"use client";

import { useMemo, useState } from "react";
import {
  emptyPersistAndListTasksMock,
  invalidPersistAndListTasksMock,
  persistAndListTasksErrorMock,
  persistAndListTasksMock,
  type TodoTask,
} from "../lib/mock/persist-and-list-tasks";
import styles from "./PersistAndListTasks.module.css";

type ViewState = "default" | "loading" | "empty" | "error" | "invalid";

function validTask(task: TodoTask) {
  return Boolean(task.id && task.title && typeof task.is_completed === "boolean" && task.created_at && task.updated_at);
}

export function PersistAndListTasks() {
  const [view, setView] = useState<ViewState>("default");

  const response = view === "empty" ? emptyPersistAndListTasksMock : view === "invalid" ? invalidPersistAndListTasksMock : persistAndListTasksMock;
  const validTasks = useMemo(() => response.tasks.filter(validTask), [response.tasks]);
  const invalidCount = response.tasks.length - validTasks.length;
  const total = validTasks.length;
  const done = validTasks.filter((task) => task.is_completed).length;
  const open = total - done;

  function retry() {
    setView("loading");
    window.setTimeout(() => setView("default"), 650);
  }

  return (
    <section className={styles.panel} aria-labelledby="persist-list-title">
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Database-backed list</p>
          <h2 id="persist-list-title" className={styles.title}>Your saved tasks</h2>
          <p className={styles.copy}>Tasks load newest first and keep completion state after refresh.</p>
        </div>
        <div className={styles.controls} aria-label="Mock state controls">
          <button className={styles.secondaryButton} type="button" onClick={() => setView("loading")}>Loading</button>
          <button className={styles.secondaryButton} type="button" onClick={() => setView("empty")}>Empty</button>
          <button className={styles.secondaryButton} type="button" onClick={() => setView("error")}>Error</button>
          <button className={styles.secondaryButton} type="button" onClick={() => setView("invalid")}>Invalid data</button>
        </div>
      </div>

      <form className={styles.form} aria-label="Add task form stays usable during list states">
        <label className={styles.label} htmlFor="persist-task-title">Task title</label>
        <div className={styles.formRow}>
          <input className={styles.input} id="persist-task-title" name="title" placeholder="Buy milk" aria-describedby="persist-task-help" />
          <button className={styles.primaryButton} type="button">Add task</button>
        </div>
        <p className={styles.help} id="persist-task-help">Add form remains available while saved tasks load or recover.</p>
      </form>

      <div className={styles.stats} aria-label="Task summary">
        <div className={styles.stat}><strong>{total}</strong><span>Total</span></div>
        <div className={styles.stat}><strong>{open}</strong><span>Open</span></div>
        <div className={styles.stat}><strong>{done}</strong><span>Done</span></div>
      </div>

      {view === "loading" ? <LoadingState /> : null}
      {view === "empty" ? <EmptyState /> : null}
      {view === "error" ? <ErrorState onRetry={retry} /> : null}
      {view === "invalid" && invalidCount > 0 ? <InvalidState invalidCount={invalidCount} /> : null}

      {view !== "loading" && view !== "empty" && view !== "error" ? (
        <ul className={styles.list} aria-live="polite">
          {validTasks.map((task) => (
            <li className={task.is_completed ? styles.itemDone : styles.itemOpen} key={task.id}>
              <span className={styles.toggle} aria-hidden="true">{task.is_completed ? "✓" : ""}</span>
              <span className={styles.taskText}>
                <span className={styles.taskTitle}>{task.title}</span>
                <span className={styles.taskState}>{task.is_completed ? "Complete" : "Incomplete"}</span>
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

function LoadingState() {
  return <div className={styles.loadingBox} role="status" aria-live="polite"><span className={styles.spinner} aria-hidden="true" />Loading tasks from database…</div>;
}

function EmptyState() {
  return <div className={styles.emptyBox}><div className={styles.illustration} role="img" aria-label="Empty clipboard" /><h3>No tasks yet</h3><p>Add one task to start.</p></div>;
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return <div className={styles.errorBox} role="alert"><h3>{persistAndListTasksErrorMock.error.message}</h3><p>Retry once network or database is available.</p><button className={styles.secondaryButton} type="button" onClick={onRetry}>Try again</button></div>;
}

function InvalidState({ invalidCount }: { invalidCount: number }) {
  return <div className={styles.errorBox} role="alert"><h3>Could not fully load tasks.</h3><p>{invalidCount} saved task had missing required data and was not shown.</p></div>;
}
