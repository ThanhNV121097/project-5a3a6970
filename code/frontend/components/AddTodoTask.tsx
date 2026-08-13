"use client";

import { FormEvent, useEffect, useRef, useState } from 'react';
import { createTodoMock, initialTodosResponse, TodoTask } from '../lib/mock/add-todo-task';
import styles from './AddTodoTask.module.css';

const maxTitleLength = 120;

export function AddTodoTask() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');
  const [tasks, setTasks] = useState<TodoTask[]>(initialTodosResponse.tasks);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [listState, setListState] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    const timer = window.setTimeout(() => setListState('ready'), 650);
    return () => window.clearTimeout(timer);
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    const trimmed = title.trim();
    if (!trimmed) {
      setFormError('Enter a task title.');
      inputRef.current?.focus();
      return;
    }
    if (trimmed.length > maxTitleLength) {
      setFormError('Title must be 120 characters or fewer.');
      inputRef.current?.focus();
      return;
    }

    setIsSubmitting(true);
    setFormError('');
    try {
      const created = await createTodoMock({ title: trimmed });
      setTasks((current) => [created, ...current]);
      setTitle('');
      setListState('ready');
      window.setTimeout(() => inputRef.current?.focus(), 0);
    } catch {
      setFormError('Could not save task. Try again.');
      inputRef.current?.focus();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className={styles.panel} aria-labelledby="add-task-title">
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Todo App</p>
          <h2 id="add-task-title" className={styles.title}>Add todo task</h2>
          <p className={styles.muted}>Create one task at a time. Duplicate titles are allowed.</p>
        </div>
        <div className={styles.stats} aria-label="Task summary">
          <span><strong>{tasks.length}</strong>Total</span>
          <span><strong>{tasks.filter((task) => !task.is_completed).length}</strong>Open</span>
        </div>
      </div>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <label className={styles.label} htmlFor="todo-title">Task title</label>
        <div className={styles.formRow}>
          <input
            ref={inputRef}
            id="todo-title"
            className={styles.input}
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              setFormError('');
            }}
            aria-describedby={formError ? 'todo-title-help todo-title-error' : 'todo-title-help'}
            aria-invalid={Boolean(formError)}
            maxLength={maxTitleLength + 1}
            placeholder="Buy milk"
            disabled={isSubmitting}
          />
          <button className={styles.button} type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving…' : 'Add task'}
          </button>
        </div>
        <p id="todo-title-help" className={styles.helper}>Trimmed title must be 1–120 characters.</p>
        {formError ? <p id="todo-title-error" className={styles.error} role="alert">{formError}</p> : null}
      </form>

      <div className={styles.listWrap} aria-live="polite">
        {listState === 'loading' ? (
          <div className={styles.loading} role="status"><span className={styles.spinner} aria-hidden="true" />Loading tasks from database…</div>
        ) : null}
        {listState === 'error' ? (
          <div className={styles.errorBox} role="alert">
            <strong>Could not load tasks.</strong>
            <span>Use retry to return to the add task flow.</span>
            <button className={styles.secondaryButton} type="button" onClick={() => setListState('loading')}>Retry</button>
          </div>
        ) : null}
        {listState === 'ready' && tasks.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyArt} aria-hidden="true" />
            <strong>No tasks yet</strong>
            <span>Add one task to start.</span>
          </div>
        ) : null}
        {listState === 'ready' && tasks.length > 0 ? (
          <ul className={styles.list}>
            {tasks.map((task) => (
              <li className={styles.item} key={task.id}>
                <button className={styles.toggle} type="button" aria-label={`Mark ${task.title} complete`} disabled />
                <span>{task.title}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
