# SRS — Todos

Module: `todos`
Last updated: 2026-08-13
Design: [View Design](http://localhost:8080/design/5a3a6970-17e9-4fe5-8dc1-2ef77ace08a5)
Design system: `design/design-system.md`

## 1. Purpose

Todos module lets a visitor manage a personal task list on one page. It supports adding, viewing, completing, uncompleting, deleting, and persisting tasks so work survives reloads. If this module does not exist, "Todo App" has no core task management value.

## 2. Actors

| Actor | Who they are | What they may do in this module |
|---|---|---|
| Visitor | Any person using the app in a browser; no sign-in exists in scope | Add tasks, view saved tasks, mark tasks complete or uncomplete, and delete tasks |

## 3. Scope

**In scope** — functions specified by plan titles:

- Add todo task
- Persist and list tasks
- Toggle task completion
- Delete todo task

**Out of scope** — expected adjacent work not part of this module:

- User accounts and per-account task lists — deliberately not built; stakeholder requested a personal app with no sign-in.
- Task due dates, priorities, tags, search, filters, and sorting controls — deliberately not built; one-page scope covers title and completion only.
- Sharing, collaboration, notifications, and email — deliberately not built; no external services needed.
- Bulk edit or bulk delete — deliberately not built; each task is managed individually.

## 4. Functional requirements

### 4.1 Add todo task

**Requirement TODOS-001 — Add task by title**

*As a* Visitor, *I want to* add a task with a title, *so that* the task appears in my todo list without reloading the page.

Behaviour:

1. Visitor opens the Todo App page and sees a clear page heading, one labelled title input, and one submit action.
2. Visitor enters a non-empty title and submits using mouse, touch, or keyboard.
3. System trims leading and trailing whitespace before validating and saving the title.
4. System creates the task as incomplete.
5. System shows the newly created task in the list without full page reload.
6. System clears the title input after successful creation and returns focus to a useful control for adding another task.

**Acceptance criteria** — each maps one-to-one onto a test case in `docs/todos/test-cases/add-todo-task.md`.

| # | Given | When | Then |
|---|---|---|---|
| AC-1 | Visitor is on the Todo App page | Page finishes initial render | Page shows a clear heading, labelled title input, and submit action |
| AC-2 | Visitor entered `Buy milk` in the title input | Visitor submits the form | List shows a new incomplete task titled `Buy milk` without full page reload |
| AC-3 | Visitor entered `  Buy milk  ` in the title input | Visitor submits the form | List shows the task title as `Buy milk` |
| AC-4 | Visitor added a valid task | Save succeeds | Title input is cleared |
| AC-5 | Visitor focus is on the title input | Visitor presses Enter | Valid task is submitted |
| AC-6 | Visitor uses keyboard only | Visitor tabs through input and submit action | Each control is reachable and has visible focus |

**Failure, boundary and permission behaviour**

| Case | Condition | Expected behaviour |
|---|---|---|
| Invalid input | Title is empty or only whitespace | Inline error appears near the input, submit does not create a task, existing list remains unchanged |
| Boundary | Trimmed title is 1 character | Task is accepted |
| Boundary | Trimmed title is 120 characters | Task is accepted |
| Boundary | Trimmed title is 121 characters | Inline error names 120-character limit, task is not saved |
| Duplicate title | Another task already has same title | Task is accepted; duplicate titles are allowed |
| Not permitted | Visitor attempts add action | Action is permitted because no sign-in or roles exist |
| Upstream failure | Save fails because persistence layer is unavailable | Error message appears, task is not shown as saved, input text remains available for retry |
| Rapid repeat submit | Visitor submits same valid title multiple times before first save returns | App prevents duplicate pending submissions for that form action |

**Data touched**

| Field | Type | Required | Rule |
|---|---|---|---|
| Task title | text | yes | Trimmed length 1–120 characters; duplicate values allowed |
| Task completion state | boolean | yes | New tasks start as incomplete |
| Task created time | datetime | yes | Captured when task is created for stable display and persistence |

### 4.2 Persist and list tasks

**Requirement TODOS-002 — Load and show saved tasks**

*As a* Visitor, *I want to* see tasks that were saved before, *so that* my todo list survives refreshes and browser restarts.

Behaviour:

1. Visitor opens or reloads the Todo App page.
2. System loads saved tasks from persistence.
3. System shows a loading state while tasks are being requested.
4. System shows saved tasks after load completes.
5. System shows a clear empty state when no tasks exist.
6. System preserves each task title and completion state across reloads.
7. System orders tasks consistently by creation time, newest first.

**Acceptance criteria** — each maps one-to-one onto a test case in `docs/todos/test-cases/persist-and-list-tasks.md`.

| # | Given | When | Then |
|---|---|---|---|
| AC-1 | Saved tasks exist | Visitor opens the Todo App page | Page shows saved tasks from persistence |
| AC-2 | Task `Buy milk` was added and save succeeded | Visitor refreshes the browser | Page still shows `Buy milk` |
| AC-3 | No tasks exist | Visitor opens the Todo App page | Page shows a clear empty state |
| AC-4 | Task loading is in progress | Visitor views the list area | Page shows a loading state |
| AC-5 | Multiple tasks exist with different created times | Visitor opens the Todo App page | Newest task appears before older tasks |
| AC-6 | Saved task is complete | Visitor refreshes the browser | Task still appears complete |

**Failure, boundary and permission behaviour**

| Case | Condition | Expected behaviour |
|---|---|---|
| Empty data | No saved tasks exist | Empty state appears and add form remains usable |
| Large list boundary | 100 saved tasks exist | Page shows all 100 tasks without horizontal scroll at supported widths |
| Data integrity | A saved task is missing title or completion state | Invalid task is not rendered; error state explains list could not fully load |
| Not permitted | Visitor attempts list action | Action is permitted because no sign-in or roles exist |
| Upstream failure | Loading tasks fails because persistence layer is unavailable | Error state appears with retry action; add form remains visible if safe to use |
| Retry | Loading failed and retry action is visible | Visitor activates retry | System attempts loading again and replaces error with loaded, empty, or error state |

**Data touched**

| Field | Type | Required | Rule |
|---|---|---|---|
| Task id | identifier | yes | Stable per task; used only to update or delete correct task |
| Task title | text | yes | Display exactly as saved after trim |
| Task completion state | boolean | yes | Display complete or incomplete state |
| Task created time | datetime | yes | Used for newest-first ordering |
| Task updated time | datetime | yes | Changes when completion state changes |

### 4.3 Toggle task completion

**Requirement TODOS-003 — Mark task complete or incomplete**

*As a* Visitor, *I want to* mark a task complete or incomplete, *so that* my list reflects current task status.

Behaviour:

1. Visitor sees each task with a visible completion control and visible completion state.
2. Visitor activates the completion control by mouse, touch, or keyboard.
3. System changes incomplete tasks to complete and complete tasks to incomplete.
4. System saves the new completion state.
5. System keeps the updated completion state after page reload.
6. System communicates the state in a way assistive technology can read.

**Acceptance criteria** — each maps one-to-one onto a test case in `docs/todos/test-cases/toggle-task-completion.md`.

| # | Given | When | Then |
|---|---|---|---|
| AC-1 | Task is incomplete | Visitor activates the completion control | Task appears complete |
| AC-2 | Task is complete | Visitor activates the completion control | Task appears incomplete |
| AC-3 | Task completion state changed and save succeeded | Visitor refreshes the browser | Task keeps changed completion state |
| AC-4 | Visitor uses keyboard only | Visitor focuses completion control and presses Space or Enter | Completion state toggles |
| AC-5 | Task appears complete | Visitor views the task | Visual state differs from incomplete tasks and is announced to assistive technology |
| AC-6 | Toggle save is in progress | Visitor views the task | Task shows pending feedback or disabled control until result is known |

**Failure, boundary and permission behaviour**

| Case | Condition | Expected behaviour |
|---|---|---|
| Not found | Task no longer exists when toggle is requested | Task is removed from list or list reloads; message explains task is no longer available |
| Not permitted | Visitor attempts toggle action | Action is permitted because no sign-in or roles exist |
| Conflict | Same task is changed in another browser before toggle completes | Last successful saved state is shown after reload or retry |
| Upstream failure | Save fails because persistence layer is unavailable | Task returns to previous visible state and error message explains change was not saved |
| Repeated toggle | Visitor rapidly activates same completion control | App serializes or disables toggles so final visible state matches persisted state |

**Data touched**

| Field | Type | Required | Rule |
|---|---|---|---|
| Task id | identifier | yes | Identifies task to update |
| Task completion state | boolean | yes | Toggles between complete and incomplete |
| Task updated time | datetime | yes | Changes when completion state changes |

### 4.4 Delete todo task

**Requirement TODOS-004 — Delete saved task**

*As a* Visitor, *I want to* delete a task, *so that* tasks I no longer need disappear from my list and stay gone.

Behaviour:

1. Visitor sees each saved task with an accessible delete control.
2. Visitor activates the delete control by mouse, touch, or keyboard.
3. System deletes the selected task from persistence.
4. System removes the deleted task from the visible list without full page reload.
5. System keeps the task absent after page reload.
6. System shows the empty state if the deleted task was the last task.

**Acceptance criteria** — each maps one-to-one onto a test case in `docs/todos/test-cases/delete-todo-task.md`.

| # | Given | When | Then |
|---|---|---|---|
| AC-1 | Task exists in the list | Visitor activates that task's delete control | Task disappears from the list |
| AC-2 | Task was deleted and delete save succeeded | Visitor refreshes the browser | Deleted task does not reappear |
| AC-3 | Visitor uses keyboard only | Visitor focuses delete control and presses Enter or Space | Task delete action runs |
| AC-4 | Deleted task was the only task | Delete succeeds | Empty state appears |
| AC-5 | Multiple tasks exist | Visitor deletes one task | Other tasks remain visible and unchanged |
| AC-6 | Delete is in progress | Visitor views the task row | Delete control shows pending feedback or is disabled until result is known |

**Failure, boundary and permission behaviour**

| Case | Condition | Expected behaviour |
|---|---|---|
| Not found | Task no longer exists when delete is requested | Task is removed from list or list reloads; no duplicate error blocks the visitor |
| Not permitted | Visitor attempts delete action | Action is permitted because no sign-in or roles exist |
| Upstream failure | Delete fails because persistence layer is unavailable | Task remains visible and error message explains delete was not saved |
| Repeated delete | Visitor rapidly activates same delete control | App prevents duplicate delete requests for same task |
| Accidental delete | Visitor activates delete control | No confirmation is required; deletion happens immediately per small personal app scope |

**Data touched**

| Field | Type | Required | Rule |
|---|---|---|---|
| Task id | identifier | yes | Identifies task to delete |
| Task title | text | yes | Used in visible row before deletion |
| Task completion state | boolean | yes | Other tasks keep current state after deletion |

## 5. Screens

Design colors: `#2563EB` primary, `#F8FAFC` background, `#FFFFFF` surface, `#10B981` accent, `#EF4444` danger.

| Screen | Section in the design | Functions it serves | States that must exist |
|---|---|---|---|
| Todo App | One-page task manager with hero, add form, task list, and controls | TODOS-001, TODOS-002, TODOS-003, TODOS-004 | default, loading, empty, error, pending save, pending toggle, pending delete |

## 6. Non-functional requirements

| Area | Requirement |
|---|---|
| Performance | Initial task list load completes within 2 seconds for 100 tasks on a typical broadband connection |
| Performance | Add, toggle, and delete interactions show visible feedback within 200 ms of activation |
| Accessibility | All controls are keyboard reachable, have visible focus, and have accessible names |
| Accessibility | Text and interactive UI contrast ratio is at least 4.5:1 against its background |
| Accessibility | Input validation and persistence errors are announced or exposed to assistive technology near the affected area |
| Responsive | Page works from 320 px viewport width and up with no horizontal page scroll |
| Motion | Motion is minimal; no required interaction depends on animation |
| Privacy | Stored data is limited to task title, completion state, and timestamps needed to manage the list |
| Localisation | User-facing copy is English |

## 7. Dependencies and assumptions

- **Depends on:** Persistence layer, for saving and loading tasks across reloads.
- **Depends on:** Approved design at [View Design](http://localhost:8080/design/5a3a6970-17e9-4fe5-8dc1-2ef77ace08a5), for visual layout, colors, and states.
- **Assumption:** No authentication or multi-user separation exists. If sign-in is added later, permissions and task ownership need new requirements.
- **Assumption:** Task title is the only editable task content. If due dates, notes, priority, or tags are added later, new requirements are needed.
- **Assumption:** Immediate delete without confirmation is acceptable for a small personal todo app. If undo or confirmation is required later, delete requirements need revision.

| Open question | Proposed default | Who decides |
|---|---|---|
| None | Use current approved scope | Stakeholder |

## 8. Traceability

| Plan item | Requirement ids | Test cases |
|---|---|---|
| Add todo task | TODOS-001 | `docs/todos/test-cases/add-todo-task.md` |
| Persist and list tasks | TODOS-002 | `docs/todos/test-cases/persist-and-list-tasks.md` |
| Toggle task completion | TODOS-003 | `docs/todos/test-cases/toggle-task-completion.md` |
| Delete todo task | TODOS-004 | `docs/todos/test-cases/delete-todo-task.md` |
