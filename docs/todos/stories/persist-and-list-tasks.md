# Story — Persist and list tasks

Module: `todos`
Plan item: Persist and list tasks
Requirement: TODOS-002 — Load and show saved tasks

## User story

As a Visitor, I want to see tasks that were saved before, so that my todo list survives refreshes and browser restarts.

## In scope

- Load saved tasks from database when Visitor opens or reloads Todo App page.
- Show list loading state while saved tasks are requested.
- Show saved task titles and completion states after load succeeds.
- Show clear empty state when no tasks exist.
- Preserve saved tasks across browser refresh after add has saved them.
- Preserve saved completion state across refresh when complete tasks already exist.
- Order loaded tasks by creation time, newest first.
- Support retry after list load failure.
- Keep add form visible and usable when no tasks exist; keep it visible during load/error when safe.
- Render up to 100 tasks without horizontal page scroll at supported widths.

## Out of scope

- Building task creation UI beyond what Add todo task story owns.
- Building complete/uncomplete interactions beyond displaying saved completion state.
- Building delete interactions.
- User accounts, task ownership, roles, or sign-in.
- Due dates, priorities, tags, search, filters, sorting controls, pagination, bulk actions, sharing, notifications, or email.
- Local storage persistence as source of truth; database remains source of truth.
- Editing task titles.

## UI scope

This story touches the approved one-page Todo App screen only, specifically the task list panel and task summary display.

States required from design system:

- Loading state box: `Loading tasks from database…`, `role="status"`, `aria-live="polite"`.
- Empty state box: `No tasks yet` and `Add one task to start.`.
- Error state box: `Could not load tasks.` plus retry action, `role="alert"`.
- Todo item open variant for incomplete saved tasks.
- Todo item done variant for complete saved tasks.
- Stats summary for total, open, and done counts.

UI must keep native controls keyboard reachable, visible focus intact, English copy, minimal motion, and no horizontal page scroll from 320 px viewport width upward.

## Acceptance criteria

1. Given saved tasks exist, when Visitor opens Todo App page, then page shows those tasks from database in task list.
2. Given task `Buy milk` was added and save succeeded, when Visitor refreshes browser, then page still shows `Buy milk`.
3. Given no tasks exist, when Visitor opens Todo App page, then page shows empty state with `No tasks yet` and `Add one task to start.`.
4. Given task loading is in progress, when Visitor views list area, then page shows loading state with `Loading tasks from database…` and exposes it through polite live status.
5. Given multiple tasks exist with different created times, when Visitor opens Todo App page, then newest task appears before older tasks.
6. Given saved task is complete, when Visitor refreshes browser, then task still appears complete with done visual state and assistive technology-readable completion state.
7. Given loading tasks fails because persistence layer is unavailable, when Visitor views list area, then error state appears with `Could not load tasks.` and retry action.
8. Given loading failed and retry action is visible, when Visitor activates retry, then system attempts loading again and replaces error with loaded, empty, or error state.
9. Given 100 saved tasks exist, when Visitor opens Todo App page at supported widths, then all 100 tasks render without horizontal page scroll.
10. Given saved task data is missing required title or completion state, when list loads, then invalid task is not rendered and error state explains list could not fully load.
11. Given list is empty or failed to load, when Visitor views page, then add form remains visible and usable when safe.
12. Given no sign-in exists, when Visitor opens Todo App page, then listing tasks is permitted without authentication.

## Dependencies

- Depends on backend persistence layer and PostgreSQL connection from project architecture.
- Depends on service design defining task list API contract.
- Depends on database schema containing stable task id, title, completion state, created time, and updated time.
- Depends on approved design and `design/design-system.md` for list, loading, empty, error, todo item, and stats summary states.
- Depends on Add todo task story for end-to-end proof that a newly added task can later be loaded after refresh.
- No external accounts, credentials, or provider setup required.

## Notes for downstream owners

- Backend remains source of truth; frontend must not treat local storage as persisted task data.
- List ordering is product-defined: newest first by created time.
- Pagination is deliberately skipped because current boundary is 100 tasks.
