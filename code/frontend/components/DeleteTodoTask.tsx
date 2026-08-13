"use client";

import { useMemo, useState } from 'react';
import { deleteTodoMock, getDeleteTodoMockList, type TodoTask } from '../lib/mock/delete-todo-task';
import styles from './DeleteTodoTask.module.css';

type ViewState = 'default' | 'loading' | 'empty' | 'error';

export default function DeleteTodoTask() {
  const initial = useMemo(() => getDeleteTodoMockList().tasks, []);
  const [tasks, setTasks] = useState<TodoTask[]>(initial);
  const [viewState, setViewState] = useState<ViewState>('default');
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [failNextDelete, setFailNextDelete] = useState(false);
  const [message, setMessage] = useState('');

  const visibleTasks = viewState === 'empty' ? [] : tasks;
  const doneCount = visibleTasks.filter((task) => task.is_completed).length;
  const openCount = visibleTasks.length - doneCount;

  async function handleDelete(task: TodoTask) {
    if (pendingId) return;

    setPendingId(task.id);
    setMessage('');

    try {
      await deleteTodoMock(task.id, failNextDelete);
      const next = tasks.filter((item) => item.id !== task.id);
      setTasks(next);
      if (next.length === 0) setViewState('empty');
      setFailNextDelete(false);
    } catch {
      setMessage('Delete was not saved. Task remains in list. Try again.');
    } finally {
      setPendingId(null);
    }
  }

  function resetDefault() {
    setTasks(initial.map((task) => ({ ...task })));
    setViewState('default');
    setPendingId(null);
    setFailNextDelete(false);
    setMessage('');
  }

  return (
    <section className={styles.panel} aria-labelledby="delete-title">
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Delete story mock</p>
          <h2 className={styles.title} id="delete-title">Your tasks</h2>
          <p className={styles.muted}>Delete control removes one saved task and keeps other tasks unchanged.</p>
        </div>
        <div className={styles.actions} aria-label="State previews">
          <button className={styles.secondaryButton} type="button" onClick={resetDefault}>Default</button>
          <button className={styles.secondaryButton} type="button" onClick={() => setViewState('loading')}>Loading</button>
          <button className={styles.secondaryButton} type="button" onClick={() => setViewState('empty')}>Empty</button>
          <button className={styles.secondaryButton} type="button" onClick={() => setViewState('error')}>Error</button>
        </div>
      </div>

      <dl className={styles.stats} aria-label="Task summary">
        <div><dt>Total</dt><dd>{visibleTasks.length}</dd></div>
        <div><dt>Open</dt><dd>{openCount}</dd></div>
        <div><dt>Done</dt><dd>{doneCount}</dd></div>
      </dl>

      <label className={styles.failToggle}>
        <input type="checkbox" checked={failNextDelete} onChange={(event) => setFailNextDelete(event.target.checked)} />
        Make next delete fail
      </label>

      {message ? <p className={styles.inlineError} role="alert">{message}</p> : null}

      <div className={styles.list} aria-live="polite">
        {viewState === 'loading' ? <LoadingState /> : null}
        {viewState === 'error' ? <ErrorState onRetry={resetDefault} /> : null}
        {viewState === 'empty' ? <EmptyState /> : null}
        {viewState === 'default' ? (
          <ul className={styles.tasks} aria-label="Saved tasks">
            {visibleTasks.map((task) => {
              const pending = pendingId === task.id;
              return (
                <li className={task.is_completed ? styles.taskDone : styles.taskOpen} key={task.id}>
                  <button className={styles.toggle} type="button" aria-label={`${task.is_completed ? 'Mark incomplete' : 'Mark complete'} ${task.title}`} disabled={pending}>
                    {task.is_completed ? '✓' : ''}
                  </button>
                  <span className={styles.taskTitle}>{task.title}</span>
                  <button
                    className={styles.deleteButton}
                    type="button"
                    aria-label={`Delete ${task.title}`}
                    disabled={pending}
                    onClick={() => handleDelete(task)}
                  >
                    {pending ? 'Deleting…' : 'Delete'}
                  </button>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>
    </section>
  );
}

function LoadingState() {
  return (
    <div className={styles.stateLoading} role="status" aria-live="polite">
      <span className={styles.spinner} aria-hidden="true" />
      <span>Loading tasks from database…</span>
    </div>
  );
}

function EmptyState() {
  return (
    <div className={styles.stateEmpty}>
      <div className={styles.emptyArt} role="img" aria-label="Empty clipboard" />
      <h3>No tasks yet</h3>
      <p>Add one task to start.</p>
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className={styles.stateError} role="alert">
      <h3>Could not load tasks.</h3>
      <p>Database tasks are unavailable in this preview.</p>
      <button className={styles.secondaryButton} type="button" onClick={onRetry}>Retry</button>
    </div>
  );
}
