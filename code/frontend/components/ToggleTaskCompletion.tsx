"use client";

import { useEffect, useState } from 'react';
import {
  buildToggleTaskCompletionSuccess,
  toggleTaskCompletionEmptyResponse,
  toggleTaskCompletionErrorResponse,
  toggleTaskCompletionInitialResponse,
  type TodoTask,
} from '../lib/mock/toggle-task-completion';
import styles from './ToggleTaskCompletion.module.css';

type ViewState = 'default' | 'loading' | 'empty' | 'error';

export function ToggleTaskCompletion() {
  const [viewState, setViewState] = useState<ViewState>('loading');
  const [tasks, setTasks] = useState<TodoTask[]>(toggleTaskCompletionInitialResponse.tasks);
  const [pendingTaskId, setPendingTaskId] = useState<string | null>(null);
  const [message, setMessage] = useState('Loading tasks from database…');
  const [failNextToggle, setFailNextToggle] = useState(false);
  const [removeNextToggle, setRemoveNextToggle] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setViewState('default');
      setMessage('Tasks loaded. Completion changes will be saved.');
    }, 650);

    return () => window.clearTimeout(timer);
  }, []);

  function loadDemo(state: ViewState) {
    setPendingTaskId(null);
    setFailNextToggle(false);
    setRemoveNextToggle(false);

    if (state === 'loading') {
      setViewState('loading');
      setMessage('Loading tasks from database…');
      window.setTimeout(() => {
        setTasks(toggleTaskCompletionInitialResponse.tasks);
        setViewState('default');
        setMessage('Tasks loaded. Completion changes will be saved.');
      }, 650);
      return;
    }

    if (state === 'empty') {
      setTasks(toggleTaskCompletionEmptyResponse.tasks);
      setViewState('empty');
      setMessage('No tasks yet. Add one task to start.');
      return;
    }

    if (state === 'error') {
      setViewState('error');
      setMessage(toggleTaskCompletionErrorResponse.error.message);
      return;
    }

    setTasks(toggleTaskCompletionInitialResponse.tasks);
    setViewState('default');
    setMessage('Tasks loaded. Completion changes will be saved.');
  }

  function toggleTask(task: TodoTask) {
    if (pendingTaskId) return;

    const previousTasks = tasks;
    const nextCompleted = !task.is_completed;
    setPendingTaskId(task.id);
    setMessage(`${task.title} ${nextCompleted ? 'marked complete' : 'marked incomplete'}. Saving…`);
    setTasks((currentTasks) => currentTasks.map((item) => (item.id === task.id ? { ...item, is_completed: nextCompleted } : item)));

    window.setTimeout(() => {
      if (removeNextToggle) {
        setTasks((currentTasks) => currentTasks.filter((item) => item.id !== task.id));
        setPendingTaskId(null);
        setRemoveNextToggle(false);
        setMessage(`${task.title} is no longer available and was removed from this list.`);
        return;
      }

      if (failNextToggle) {
        setTasks(previousTasks);
        setPendingTaskId(null);
        setFailNextToggle(false);
        setMessage(`${task.title} was not saved. Previous completion state restored.`);
        return;
      }

      const savedTask = buildToggleTaskCompletionSuccess(task, nextCompleted);
      setTasks((currentTasks) => currentTasks.map((item) => (item.id === task.id ? savedTask : item)));
      setPendingTaskId(null);
      setMessage(`${task.title} saved as ${nextCompleted ? 'complete' : 'incomplete'}.`);
    }, 650);
  }

  return (
    <section className={styles.card} aria-labelledby="toggle-title">
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Completion state</p>
          <h2 id="toggle-title" className={styles.title}>Toggle task completion</h2>
          <p className={styles.copy}>Use native buttons to mark saved tasks complete or incomplete with mouse, touch, Enter, or Space.</p>
        </div>
        <div className={styles.actions} aria-label="Demo states">
          <button className={styles.secondaryButton} type="button" onClick={() => loadDemo('loading')}>Loading</button>
          <button className={styles.secondaryButton} type="button" onClick={() => loadDemo('empty')}>Empty</button>
          <button className={styles.secondaryButton} type="button" onClick={() => loadDemo('error')}>Error</button>
        </div>
      </div>

      <div className={styles.failureControls} aria-label="Toggle failure demos">
        <label className={styles.checkLabel}>
          <input type="checkbox" checked={failNextToggle} onChange={(event) => setFailNextToggle(event.target.checked)} />
          Fail next save
        </label>
        <label className={styles.checkLabel}>
          <input type="checkbox" checked={removeNextToggle} onChange={(event) => setRemoveNextToggle(event.target.checked)} />
          Remove next task as missing
        </label>
      </div>

      <p className={styles.status} role="status" aria-live="polite">{message}</p>

      {viewState === 'loading' ? <LoadingState /> : null}
      {viewState === 'empty' ? <EmptyState /> : null}
      {viewState === 'error' ? <ErrorState onRetry={() => loadDemo('loading')} /> : null}
      {viewState === 'default' ? (
        <ul className={styles.list} aria-live="polite" aria-label="Saved tasks">
          {tasks.map((task) => {
            const isPending = pendingTaskId === task.id;
            return (
              <li className={task.is_completed ? styles.itemDone : styles.item} key={task.id}>
                <button
                  className={task.is_completed ? styles.toggleDone : styles.toggle}
                  type="button"
                  aria-label={`Mark ${task.title} ${task.is_completed ? 'incomplete' : 'complete'}`}
                  aria-pressed={task.is_completed}
                  disabled={isPending}
                  onClick={() => toggleTask(task)}
                >
                  <span aria-hidden="true">{task.is_completed ? '✓' : ''}</span>
                </button>
                <span className={task.is_completed ? styles.titleDone : styles.taskTitle}>{task.title}</span>
                <span className={styles.badge}>{isPending ? 'Saving…' : task.is_completed ? 'Done' : 'Open'}</span>
              </li>
            );
          })}
        </ul>
      ) : null}
    </section>
  );
}

function LoadingState() {
  return (
    <div className={styles.loadingBox} role="status" aria-live="polite">
      <span className={styles.spinner} aria-hidden="true" />
      <span>Loading tasks from database…</span>
    </div>
  );
}

function EmptyState() {
  return (
    <div className={styles.emptyBox}>
      <div className={styles.emptyArt} role="img" aria-label="Empty task list" />
      <h3 className={styles.stateTitle}>No tasks yet</h3>
      <p className={styles.copy}>Add one task to start.</p>
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className={styles.errorBox} role="alert">
      <h3 className={styles.stateTitle}>Could not load tasks.</h3>
      <p className={styles.copy}>Tasks are unavailable. Try again.</p>
      <button className={styles.secondaryButton} type="button" onClick={onRetry}>Retry</button>
    </div>
  );
}
