"use client";

import { FormEvent, useEffect, useState } from "react";

type TodoTask = { id: string; title: string; is_completed: boolean; created_at: string; updated_at: string };
type TodoList = { tasks: TodoTask[]; next_cursor: string | null; has_more: boolean };

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, { ...init, headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) } });
  if (!res.ok) throw new Error(res.status === 404 ? "Task is no longer available." : "Change was not saved.");
  return res.status === 204 ? (undefined as T) : res.json();
}

export default function Page() {
  const [tasks, setTasks] = useState<TodoTask[]>([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  async function load() {
    setLoading(true); setMessage("");
    try { setTasks((await api<TodoList>("/api/v1/todos")).tasks); }
    catch { setMessage("Tasks could not load."); }
    finally { setLoading(false); }
  }

  useEffect(() => { void load(); }, []);

  async function addTask(event: FormEvent) {
    event.preventDefault();
    const trimmed = title.trim();
    if (!trimmed || trimmed.length > 120) { setMessage("Title must be 1 to 120 characters."); return; }
    setPending("new"); setMessage("");
    try { const task = await api<TodoTask>("/api/v1/todos", { method: "POST", body: JSON.stringify({ title: trimmed }) }); setTasks([task, ...tasks]); setTitle(""); }
    catch { setMessage("Task was not saved."); }
    finally { setPending(null); }
  }

  async function toggleTask(task: TodoTask) {
    const next = !task.is_completed;
    setPending(task.id); setMessage("");
    setTasks(tasks.map((t) => t.id === task.id ? { ...t, is_completed: next } : t));
    try { const saved = await api<TodoTask>(`/api/v1/todos/${task.id}`, { method: "PATCH", body: JSON.stringify({ is_completed: next }) }); setTasks((current) => current.map((t) => t.id === task.id ? saved : t)); }
    catch (error) { setTasks((current) => current.map((t) => t.id === task.id ? task : t)); setMessage(error instanceof Error ? error.message : "Change was not saved."); if (error instanceof Error && error.message.includes("no longer")) void load(); }
    finally { setPending(null); }
  }

  async function deleteTask(task: TodoTask) {
    setPending(task.id); setMessage("");
    try { await api<void>(`/api/v1/todos/${task.id}`, { method: "DELETE" }); setTasks(tasks.filter((t) => t.id !== task.id)); }
    catch { setMessage("Task was not deleted."); }
    finally { setPending(null); }
  }

  const done = tasks.filter((task) => task.is_completed).length;

  return (
    <main className="shell">
      <section className="hero-card" aria-labelledby="page-title">
        <p className="eyebrow">Personal task manager</p><h1 id="page-title">Todo App</h1>
        <p className="lede">Add tasks, keep track of progress, and return later with your list still saved.</p>
      </section>
      <section className="panel" aria-labelledby="tasks-title">
        <h2 id="tasks-title">Your tasks</h2>
        <form className="todo-form" onSubmit={addTask}>
          <input className="input" value={title} maxLength={120} onChange={(e) => setTitle(e.target.value)} placeholder="Add a task" aria-label="Task title" />
          <button className="btn" disabled={pending === "new"}>{pending === "new" ? "Saving…" : "Add task"}</button>
        </form>
        <p className="muted">{tasks.length} saved · {done} complete · {tasks.length - done} open</p>
        {message && <p className="error" role="alert">{message}</p>}
        {loading ? <div className="state-box">Loading saved tasks…</div> : tasks.length === 0 ? <div className="state-box">No saved tasks yet.</div> : (
          <ul className="todo-list">
            {tasks.map((task) => <li className={`todo-item ${task.is_completed ? "done" : ""}`} key={task.id}>
              <button className="toggle-task" disabled={pending === task.id} aria-pressed={task.is_completed} onClick={() => toggleTask(task)}>{pending === task.id ? "…" : "✓"}</button>
              <span>{task.title}</span>
              <button className="delete-task" disabled={pending === task.id} onClick={() => deleteTask(task)}>Delete</button>
            </li>)}
          </ul>
        )}
      </section>
    </main>
  );
}
