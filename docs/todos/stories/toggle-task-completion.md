# Story — Toggle task completion

Module: `todos`
Plan item: Toggle task completion
Requirement: TODOS-003 — Mark task complete or incomplete

## User story

As a Visitor, I want to mark a task complete or incomplete, so that my list reflects current task status.

## In scope

- Show every saved task with a visible completion control and visible completion state.
- Let the Visitor toggle an incomplete task to complete.
- Let the Visitor toggle a complete task back to incomplete.
- Support mouse, touch, keyboard Enter, and keyboard Space activation.
- Save the changed completion state through the Go API to PostgreSQL.
- Keep the changed completion state after browser reload.
- Show pending feedback or disable the completion control while toggle save is in progress.
- Roll back to the previous visible state and show an error if save fails.
- Expose completion state and errors to assistive technology.

## Out of scope

- Creating tasks; covered by Add todo task.
- Initial loading, empty, and general list persistence; covered by Persist and list tasks.
- Deleting tasks; covered by Delete todo task.
- Editing task title, due dates, priorities, tags, search, filters, and sorting controls.
- Bulk complete, bulk uncomplete, bulk edit, or bulk delete.
- Authentication, per-user permissions, sharing, collaboration, notifications, and external services.
- Undo, confirmation, or task history for completion changes.

## UI scope

Touches the approved Todo App one-page task manager only.

- Task list rows use the Todo item component from the design system: `[toggle button] [task title] [delete button]`.
- Open tasks show normal title styling, unchecked toggle state, and accessible name such as `Mark Buy milk complete`.
- Done tasks use the Done variant: success-tinted row background, completed toggle styling, muted title, and accessible name such as `Mark Buy milk incomplete`.
- Completion controls are native `button` elements with visible focus rings.
- List region uses polite live updates for state changes and errors where appropriate.
- Pending toggle state keeps row footprint stable and either disables the toggle control or gives visible pending feedback until save result is known.
- Upstream failure shows clear error copy near the affected task or list and restores the previous visible state.

## Acceptance criteria

1. Given an incomplete saved task is visible, when the Visitor activates its completion control by mouse or touch, then the task appears complete without full page reload.
2. Given a complete saved task is visible, when the Visitor activates its completion control by mouse or touch, then the task appears incomplete without full page reload.
3. Given a task completion state changed and save succeeded, when the Visitor refreshes the browser, then the task keeps the changed completion state.
4. Given the Visitor uses keyboard only, when focus is on a completion control and the Visitor presses Space, then that task completion state toggles.
5. Given the Visitor uses keyboard only, when focus is on a completion control and the Visitor presses Enter, then that task completion state toggles.
6. Given a task appears complete, when the Visitor views the row, then visual state differs from incomplete tasks through approved Done styling and assistive technology can read the state.
7. Given toggle save is in progress, when the Visitor views the task row, then the row shows pending feedback or the completion control is disabled until the save result is known.
8. Given toggle save fails because persistence is unavailable, when the failure is returned, then the task returns to its previous visible state and an error explains the change was not saved.
9. Given the task no longer exists when toggle is requested, when the API reports not found, then the task is removed from the list or the list reloads and a message explains the task is no longer available.
10. Given the Visitor rapidly activates the same completion control repeatedly, when previous toggle save is still pending, then duplicate toggle requests for that task are prevented or serialized so the final visible state matches the persisted state.
11. Given multiple tasks are visible, when one task is toggled, then other tasks remain visible and keep their current titles and completion states.

## Dependencies

- Add todo task must exist or test data must be seeded, so at least one task can be toggled.
- Persist and list tasks must exist, so saved tasks render with stable ids and reload verification is possible.
- Backend API must expose a task update path that accepts task id and completion state.
- PostgreSQL persistence must store task id, completion state, and updated time.
- Approved design and design system remain source of truth for visual states.
- No external accounts or credentials are needed.
