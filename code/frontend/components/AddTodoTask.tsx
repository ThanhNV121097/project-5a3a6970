"use client";

import { FormEvent, useEffect, useRef, useState } from 'react';
import { createTodoMock, initialTodosResponse, TodoTask } from '../lib/mock/add-todo-task';

const maxTitleLength = 120;

export function AddTodoTask() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');
  const [tasks, setTasks] = useState<TodoTask[]>(initialTodosResponse.tasks);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [listState, setListState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [formError, setFormError] = useState('');

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
    <section className="panel" aria-labelledby="add-task-title">
      <p className="eyebrow">Personal task manager</p>
      <h1 id="add-task-title">Todo App</h1>
      <p className="lede">Add a task by title. New tasks appear here without reloading.</p>

      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="todo-title">Task title</label>
        <input
          ref={inputRef}
          id="todo-title"
          className="input"
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
        <p id="todo-title-help" className="muted">Trimmed title must be 1–120 characters.</p>
        {formError ? <p id="todo-title-error" className="error" role="alert">{formError}</p> : null}
        <button className="btn" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving…' : 'Add task'}</button>
      </form>

      <section aria-labelledby="todo-list-title" aria-live="polite">
        <h2 id="todo-list-title">Your tasks</h2>
        {listState === 'loading' ? <div className="state-box" role="status">Loading tasks from database…</div> : null}
        {listState === 'error' ? (
          <div className="state-box" role="alert">
            <strong>Could not load tasks.</strong>
            <p>Use retry to return to the add task flow.</p>
            <button className="btn" type="button" onClick={() => setListState('loading')}>Retry</button>
          </div>
        ) : null}
        {listState === 'ready' && tasks.length === 0 ? (
          <div className="state-box">
            <strong>No tasks yet</strong>
            <p>Add one task to start.</p>
          </div>
        ) : null}
        {listState === 'ready' && tasks.length > 0 ? (
          <ul>
            {tasks.map((task) => (
              <li key={task.id}>
                <button type="button" aria-label={`Mark ${task.title} complete`} disabled>□</button>
                <span>{task.title}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </section>
    </section>
  );
}
