package main

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"net"
	"net/http"
	"os"
	"sort"
	"strings"
	"sync"
	"time"

	"github.com/ThanhNV121097/project-5a3a6970/backend/migrations"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgxpool"
)

type api struct {
	pool    *pgxpool.Pool
	limiter *rateLimiter
}

type todo struct {
	ID          string    `json:"id"`
	Title       string    `json:"title"`
	IsCompleted bool      `json:"is_completed"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type todoList struct {
	Tasks      []todo  `json:"tasks"`
	NextCursor *string `json:"next_cursor"`
	HasMore    bool    `json:"has_more"`
}

type fieldError struct {
	Field   string `json:"field"`
	Code    string `json:"code"`
	Message string `json:"message"`
}

type errorEnvelope struct {
	Error struct {
		Code      string       `json:"code"`
		Message   string       `json:"message"`
		Details   []fieldError `json:"details"`
		RequestID string       `json:"request_id"`
	} `json:"error"`
}

func main() {
	databaseURL := os.Getenv("DATABASE_URL")
	if databaseURL == "" {
		log.Fatal("DATABASE_URL is required")
	}

	port := firstSet(os.Getenv("PORT"), os.Getenv("APP_PORT"), "8080")
	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()

	pool, err := pgxpool.New(ctx, databaseURL)
	if err != nil {
		log.Fatalf("connect database: %v", err)
	}
	defer pool.Close()

	if err := applyMigrations(ctx, pool); err != nil {
		log.Fatalf("apply migrations: %v", err)
	}

	a := &api{pool: pool, limiter: newRateLimiter(60, time.Minute)}
	mux := http.NewServeMux()
	mux.HandleFunc("/healthz", a.health)
	mux.HandleFunc("/api/v1/todos", a.todos)
	mux.HandleFunc("/api/v1/todos/", a.todoByID)

	server := &http.Server{Addr: ":" + port, Handler: withCORS(withRequestLog(mux)), ReadHeaderTimeout: 5 * time.Second}
	log.Printf("api listening on :%s", port)
	if err := server.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
		log.Fatal(err)
	}
}

func (a *api) health(w http.ResponseWriter, r *http.Request) {
	requestID := ensureRequestID(w, r)
	if r.Method != http.MethodGet {
		writeError(w, requestID, "BAD_REQUEST", "Unsupported method.", nil, http.StatusBadRequest)
		return
	}
	ctx, cancel := context.WithTimeout(r.Context(), time.Second)
	defer cancel()
	if err := a.pool.Ping(ctx); err != nil {
		writeError(w, requestID, "UNAVAILABLE", "Service is unavailable.", nil, http.StatusServiceUnavailable)
		return
	}
	writeJSON(w, http.StatusOK, map[string]bool{"ok": true})
}

func (a *api) todos(w http.ResponseWriter, r *http.Request) {
	requestID := ensureRequestID(w, r)
	if !a.allow(w, r, requestID) {
		return
	}
	switch r.Method {
	case http.MethodGet:
		a.listTodos(w, r, requestID)
	case http.MethodPost:
		a.createTodo(w, r, requestID)
	default:
		writeError(w, requestID, "BAD_REQUEST", "Unsupported method.", nil, http.StatusBadRequest)
	}
}

func (a *api) todoByID(w http.ResponseWriter, r *http.Request) {
	requestID := ensureRequestID(w, r)
	if !a.allow(w, r, requestID) {
		return
	}
	id := strings.TrimPrefix(r.URL.Path, "/api/v1/todos/")
	if id == "" || strings.Contains(id, "/") || !isUUID(id) {
		writeError(w, requestID, "BAD_REQUEST", "Invalid task ID.", nil, http.StatusBadRequest)
		return
	}
	switch r.Method {
	case http.MethodPatch:
		a.patchTodo(w, r, requestID, id)
	case http.MethodDelete:
		a.deleteTodo(w, r, requestID, id)
	default:
		writeError(w, requestID, "BAD_REQUEST", "Unsupported method.", nil, http.StatusBadRequest)
	}
}

func (a *api) listTodos(w http.ResponseWriter, r *http.Request, requestID string) {
	if err := rejectBodyForRead(r); err != nil {
		writeError(w, requestID, "BAD_REQUEST", err.Error(), nil, http.StatusBadRequest)
		return
	}
	ctx, cancel := context.WithTimeout(r.Context(), 2*time.Second)
	defer cancel()
	rows, err := a.pool.Query(ctx, `SELECT id::text, title, is_completed, created_at, updated_at FROM todos ORDER BY created_at DESC, id DESC LIMIT 100`)
	if err != nil {
		writeDBError(w, requestID, err)
		return
	}
	defer rows.Close()
	tasks := []todo{}
	for rows.Next() {
		var t todo
		if err := rows.Scan(&t.ID, &t.Title, &t.IsCompleted, &t.CreatedAt, &t.UpdatedAt); err != nil {
			writeDBError(w, requestID, err)
			return
		}
		tasks = append(tasks, t)
	}
	if err := rows.Err(); err != nil {
		writeDBError(w, requestID, err)
		return
	}
	writeJSON(w, http.StatusOK, todoList{Tasks: tasks, HasMore: false})
}

func (a *api) createTodo(w http.ResponseWriter, r *http.Request, requestID string) {
	body, ok := readJSONBody(w, r, requestID)
	if !ok {
		return
	}
	titleValue, exists := body["title"]
	if extra := unknownFields(body, "title"); len(extra) > 0 {
		writeError(w, requestID, "BAD_REQUEST", "Unknown field.", []fieldError{{Field: extra[0], Code: "UNKNOWN", Message: "Field is not supported."}}, http.StatusBadRequest)
		return
	}
	if !exists {
		writeError(w, requestID, "VALIDATION_FAILED", "Title is required.", []fieldError{{Field: "title", Code: "REQUIRED", Message: "Title is required."}}, http.StatusUnprocessableEntity)
		return
	}
	title, ok := titleValue.(string)
	if !ok {
		writeError(w, requestID, "VALIDATION_FAILED", "Title must be text.", []fieldError{{Field: "title", Code: "TYPE", Message: "Title must be text."}}, http.StatusUnprocessableEntity)
		return
	}
	title = strings.TrimSpace(title)
	if title == "" {
		writeError(w, requestID, "VALIDATION_FAILED", "Title is required.", []fieldError{{Field: "title", Code: "REQUIRED", Message: "Title is required."}}, http.StatusUnprocessableEntity)
		return
	}
	if len([]rune(title)) > 120 {
		writeError(w, requestID, "VALIDATION_FAILED", "Title must be 120 characters or fewer.", []fieldError{{Field: "title", Code: "TOO_LONG", Message: "Title must be 120 characters or fewer."}}, http.StatusUnprocessableEntity)
		return
	}
	ctx, cancel := context.WithTimeout(r.Context(), 2*time.Second)
	defer cancel()
	var t todo
	err := a.pool.QueryRow(ctx, `INSERT INTO todos (title) VALUES ($1) RETURNING id::text, title, is_completed, created_at, updated_at`, title).Scan(&t.ID, &t.Title, &t.IsCompleted, &t.CreatedAt, &t.UpdatedAt)
	if err != nil {
		writeDBError(w, requestID, err)
		return
	}
	w.Header().Set("Location", "/api/v1/todos/"+t.ID)
	writeJSON(w, http.StatusCreated, t)
}

func (a *api) patchTodo(w http.ResponseWriter, r *http.Request, requestID, id string) {
	body, ok := readJSONBody(w, r, requestID)
	if !ok {
		return
	}
	completedValue, exists := body["is_completed"]
	if extra := unknownFields(body, "is_completed"); len(extra) > 0 {
		writeError(w, requestID, "BAD_REQUEST", "Unknown field.", []fieldError{{Field: extra[0], Code: "UNKNOWN", Message: "Field is not supported."}}, http.StatusBadRequest)
		return
	}
	if !exists {
		writeError(w, requestID, "VALIDATION_FAILED", "Completion state is required.", []fieldError{{Field: "is_completed", Code: "REQUIRED", Message: "Completion state is required."}}, http.StatusUnprocessableEntity)
		return
	}
	completed, ok := completedValue.(bool)
	if !ok {
		writeError(w, requestID, "VALIDATION_FAILED", "Completion state must be true or false.", []fieldError{{Field: "is_completed", Code: "TYPE", Message: "Completion state must be true or false."}}, http.StatusUnprocessableEntity)
		return
	}
	ctx, cancel := context.WithTimeout(r.Context(), 2*time.Second)
	defer cancel()
	var t todo
	err := a.pool.QueryRow(ctx, `UPDATE todos SET is_completed = $1, updated_at = now() WHERE id = $2 RETURNING id::text, title, is_completed, created_at, updated_at`, completed, id).Scan(&t.ID, &t.Title, &t.IsCompleted, &t.CreatedAt, &t.UpdatedAt)
	if errors.Is(err, pgx.ErrNoRows) {
		writeError(w, requestID, "NOT_FOUND", "Task is no longer available.", nil, http.StatusNotFound)
		return
	}
	if err != nil {
		writeDBError(w, requestID, err)
		return
	}
	writeJSON(w, http.StatusOK, t)
}

func (a *api) deleteTodo(w http.ResponseWriter, r *http.Request, requestID, id string) {
	if err := rejectBodyForRead(r); err != nil {
		writeError(w, requestID, "BAD_REQUEST", err.Error(), nil, http.StatusBadRequest)
		return
	}
	ctx, cancel := context.WithTimeout(r.Context(), 2*time.Second)
	defer cancel()
	if _, err := a.pool.Exec(ctx, `DELETE FROM todos WHERE id = $1`, id); err != nil {
		writeDBError(w, requestID, err)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func (a *api) allow(w http.ResponseWriter, r *http.Request, requestID string) bool {
	if a.limiter.allow(clientIP(r)) {
		return true
	}
	w.Header().Set("Retry-After", "60")
	writeError(w, requestID, "RATE_LIMITED", "Too many requests.", nil, http.StatusTooManyRequests)
	return false
}

func readJSONBody(w http.ResponseWriter, r *http.Request, requestID string) (map[string]any, bool) {
	if !strings.HasPrefix(r.Header.Get("Content-Type"), "application/json") {
		writeError(w, requestID, "BAD_REQUEST", "Content-Type must be application/json.", nil, http.StatusBadRequest)
		return nil, false
	}
	r.Body = http.MaxBytesReader(w, r.Body, 16*1024)
	decoder := json.NewDecoder(r.Body)
	decoder.UseNumber()
	var body map[string]any
	if err := decoder.Decode(&body); err != nil {
		writeError(w, requestID, "BAD_REQUEST", "Request body must be valid JSON object.", nil, http.StatusBadRequest)
		return nil, false
	}
	if body == nil {
		writeError(w, requestID, "BAD_REQUEST", "Request body must be valid JSON object.", nil, http.StatusBadRequest)
		return nil, false
	}
	if decoder.Decode(&struct{}{}) != io.EOF {
		writeError(w, requestID, "BAD_REQUEST", "Request body must contain one JSON object.", nil, http.StatusBadRequest)
		return nil, false
	}
	return body, true
}

func rejectBodyForRead(r *http.Request) error {
	if r.Body == nil || r.Body == http.NoBody {
		return nil
	}
	if r.Header.Get("Content-Type") != "" && !strings.HasPrefix(r.Header.Get("Content-Type"), "application/json") {
		return errors.New("Content-Type must be application/json.")
	}
	body, err := io.ReadAll(io.LimitReader(r.Body, 1))
	if err != nil {
		return errors.New("Request body must be empty.")
	}
	if len(body) > 0 {
		return errors.New("Request body must be empty.")
	}
	return nil
}

func unknownFields(body map[string]any, allowed ...string) []string {
	allow := map[string]bool{}
	for _, field := range allowed {
		allow[field] = true
	}
	var extra []string
	for field := range body {
		if !allow[field] {
			extra = append(extra, field)
		}
	}
	sort.Strings(extra)
	return extra
}

func writeDBError(w http.ResponseWriter, requestID string, err error) {
	var pgErr *pgconn.PgError
	if errors.As(err, &pgErr) && strings.HasPrefix(pgErr.Code, "08") {
		writeError(w, requestID, "UNAVAILABLE", "Service is unavailable.", nil, http.StatusServiceUnavailable)
		return
	}
	if errors.Is(err, context.DeadlineExceeded) || errors.Is(err, context.Canceled) {
		writeError(w, requestID, "UNAVAILABLE", "Service is unavailable.", nil, http.StatusServiceUnavailable)
		return
	}
	writeError(w, requestID, "INTERNAL", "Something went wrong.", nil, http.StatusInternalServerError)
}

func writeError(w http.ResponseWriter, requestID, code, message string, details []fieldError, status int) {
	if details == nil {
		details = []fieldError{}
	}
	var envelope errorEnvelope
	envelope.Error.Code = code
	envelope.Error.Message = message
	envelope.Error.Details = details
	envelope.Error.RequestID = requestID
	writeJSON(w, status, envelope)
}

func writeJSON(w http.ResponseWriter, status int, value any) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(value)
}

func ensureRequestID(w http.ResponseWriter, r *http.Request) string {
	requestID := strings.TrimSpace(r.Header.Get("X-Request-Id"))
	if requestID == "" {
		requestID = randomID()
	}
	w.Header().Set("X-Request-Id", requestID)
	return requestID
}

func randomID() string {
	var b [16]byte
	if _, err := rand.Read(b[:]); err != nil {
		return fmt.Sprintf("%d", time.Now().UnixNano())
	}
	return hex.EncodeToString(b[:])
}

func isUUID(value string) bool {
	if len(value) != 36 {
		return false
	}
	for i, c := range value {
		switch i {
		case 8, 13, 18, 23:
			if c != '-' {
				return false
			}
		default:
			if !((c >= '0' && c <= '9') || (c >= 'a' && c <= 'f') || (c >= 'A' && c <= 'F')) {
				return false
			}
		}
	}
	return true
}

func firstSet(values ...string) string {
	for _, value := range values {
		if value != "" {
			return value
		}
	}
	return ""
}

func withCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, X-Request-Id")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS")
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func withRequestLog(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		recorder := &statusRecorder{ResponseWriter: w, status: http.StatusOK}
		next.ServeHTTP(recorder, r)
		log.Printf("request_id=%s method=%s path=%s status=%d duration_ms=%d remote_addr=%s user_agent=%q", w.Header().Get("X-Request-Id"), r.Method, r.URL.Path, recorder.status, time.Since(start).Milliseconds(), clientIP(r), r.UserAgent())
	})
}

type statusRecorder struct {
	http.ResponseWriter
	status int
}

func (r *statusRecorder) WriteHeader(status int) {
	r.status = status
	r.ResponseWriter.WriteHeader(status)
}

type rateLimiter struct {
	mu      sync.Mutex
	limit   int
	window  time.Duration
	clients map[string][]time.Time
}

func newRateLimiter(limit int, window time.Duration) *rateLimiter {
	return &rateLimiter{limit: limit, window: window, clients: map[string][]time.Time{}}
}

func (l *rateLimiter) allow(key string) bool {
	l.mu.Lock()
	defer l.mu.Unlock()
	now := time.Now()
	cutoff := now.Add(-l.window)
	kept := l.clients[key][:0]
	for _, hit := range l.clients[key] {
		if hit.After(cutoff) {
			kept = append(kept, hit)
		}
	}
	if len(kept) >= l.limit {
		l.clients[key] = kept
		return false
	}
	l.clients[key] = append(kept, now)
	return true
}

func clientIP(r *http.Request) string {
	host, _, err := net.SplitHostPort(r.RemoteAddr)
	if err != nil {
		return r.RemoteAddr
	}
	return host
}

func applyMigrations(ctx context.Context, pool *pgxpool.Pool) error {
	if _, err := pool.Exec(ctx, `CREATE TABLE IF NOT EXISTS schema_migrations (filename text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())`); err != nil {
		return err
	}

	entries, err := migrations.Files.ReadDir(".")
	if err != nil {
		return err
	}

	var names []string
	for _, entry := range entries {
		if !entry.IsDir() && strings.HasSuffix(entry.Name(), ".up.sql") {
			names = append(names, entry.Name())
		}
	}
	sort.Strings(names)

	for _, name := range names {
		var exists bool
		if err := pool.QueryRow(ctx, `SELECT EXISTS (SELECT 1 FROM schema_migrations WHERE filename = $1)`, name).Scan(&exists); err != nil {
			return fmt.Errorf("check %s: %w", name, err)
		}
		if exists {
			continue
		}

		sqlBytes, err := migrations.Files.ReadFile(name)
		if err != nil {
			return err
		}

		tx, err := pool.Begin(ctx)
		if err != nil {
			return err
		}
		if _, err := tx.Exec(ctx, string(sqlBytes)); err != nil {
			_ = tx.Rollback(ctx)
			return fmt.Errorf("run %s: %w", name, err)
		}
		if _, err := tx.Exec(ctx, `INSERT INTO schema_migrations (filename) VALUES ($1)`, name); err != nil {
			_ = tx.Rollback(ctx)
			return fmt.Errorf("record %s: %w", name, err)
		}
		if err := tx.Commit(ctx); err != nil {
			return err
		}
	}
	return nil
}
