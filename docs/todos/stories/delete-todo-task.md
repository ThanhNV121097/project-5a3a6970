# Story — Delete todo task

Module: `todos`
Plan item: Delete todo task
Requirement: TODOS-004 — Delete saved task

## User story

As a Visitor, I want to delete a saved task, so that tasks I no longer need disappear from my list and stay gone.

## In scope

- Show one accessible delete control for each saved task in the task list.
- Allow delete activation by mouse, touch, keyboard Enter, and keyboard Space.
- Delete only the selected task from persistence.
- Remove the deleted task from the visible list without full page reload after successful deletion.
- Keep deleted task absent after browser reload.
- Show pending feedback or disable delete control while delete request is in progress.
- Show empty state when deleted task was the last task.
- Keep all other visible tasks and completion states unchanged.
- Handle delete failure without losing visible task data.
- Treat missing task during delete as already gone: remove it from visible list or reload list, without blocking visitor with duplicate error.

## Out of scope

- Add, list, or toggle implementation beyond what this delete story needs to operate on existing saved tasks.
- Undo delete, confirmation dialogs, trash/archive, soft delete, or restore flow.
- Bulk delete or deleting completed tasks as a group.
- User accounts, per-user ownership, roles, or permissions.
- Task due dates, priorities, tags, search, filters, or sorting controls.
- External notifications, email, sharing, or audit history.

## UI scope

Touches the approved one-page Todo App task list only.

Use the `Todo item` component from the design system:

- Each visible task row includes a danger compact native `button` for delete.
- Delete button accessible name includes task title, for example `Delete Buy milk`.
- Delete button has visible focus ring and remains keyboard reachable.
- Pending delete state disables or otherwise blocks repeated activation for that same task while preserving row footprint.
- On success, row disappears and list count updates.
- If no tasks remain, replace list with empty state using approved empty-state pattern: `No tasks yet` and `Add one task to start.`
- If delete fails, task remains visible and error copy appears near list area, exposed to assistive technology.

## Acceptance criteria

1. Given a saved task appears in the list, when Visitor activates that task's delete control, then that task disappears from the list without full page reload after delete succeeds.
2. Given a task was deleted and delete save succeeded, when Visitor refreshes the browser, then deleted task does not reappear.
3. Given Visitor uses keyboard only, when Visitor focuses a task's delete control and presses Enter, then delete action runs for that task.
4. Given Visitor uses keyboard only, when Visitor focuses a task's delete control and presses Space, then delete action runs for that task.
5. Given deleted task was the only visible task, when delete succeeds, then approved empty state appears.
6. Given multiple tasks exist, when Visitor deletes one task, then other tasks remain visible with unchanged titles and completion states.
7. Given delete request is in progress for a task, when Visitor views that row, then delete control shows pending feedback or is disabled until result is known.
8. Given delete request is in progress for a task, when Visitor rapidly activates the same delete control again, then app prevents duplicate delete requests for that same task.
9. Given persistence layer rejects or cannot complete delete, when delete fails, then task remains visible and an error message explains delete was not saved.
10. Given task no longer exists when delete is requested, when backend reports not found or list reload detects absence, then task is removed from visible list or list reloads without blocking Visitor with duplicate error.
11. Given Visitor attempts delete action, when no sign-in exists, then action is permitted.

## Dependencies

- Requires persisted tasks from TODOS-002 to exist for normal delete flow.
- Depends on task identifiers from persistence so selected task can be deleted precisely.
- Depends on approved design and design system for danger compact delete button, empty state, focus, pending, and error states.
- Depends on Go API and PostgreSQL service contract from architecture stages.
- No external accounts, credentials, or provider setup required.
