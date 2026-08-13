# Story — Add todo task

Module: `todos`
Plan item: Add todo task
Requirement: TODOS-001 — Add task by title

## User story

As a Visitor, I want to add a task with a title, so that the task appears in my todo list without reloading the page.

## In scope

- One accessible Todo App page section for adding a task by title.
- Clear page heading, labelled title input, helper/error text, and submit action.
- Client-side validation for empty or whitespace-only title before create request.
- Title trimming before validation and save.
- Title length validation: trimmed length must be 1–120 characters.
- Successful create adds a new incomplete task to the visible list without full page reload.
- Successful create clears the input and returns focus to the title input for adding another task.
- Duplicate task titles are allowed.
- Keyboard add flow: input focus, Enter submit, tab to submit, visible focus states.
- Pending create feedback that prevents duplicate pending submissions for the form action.
- Create failure feedback that keeps typed input available for retry.

## Out of scope

- Loading saved tasks from persistence on page load; covered by `Persist and list tasks`.
- Full list empty, loading, and retry states beyond what is needed to show newly added task feedback.
- Toggle complete or uncomplete; covered by `Toggle task completion`.
- Delete task; covered by `Delete todo task`.
- Task editing after creation.
- Due dates, priorities, tags, filters, sorting controls, search, notes, sharing, notifications, and bulk actions.
- User accounts, sign-in, per-user ownership, and permissions beyond Visitor access.
- Undo, confirmation, or toast framework.

## UI scope

- Screen: approved one-page Todo App.
- Use approved design system tokens: primary `#2563EB`, background `#F8FAFC`, surface `#FFFFFF`, accent `#10B981`, danger `#EF4444`.
- Touch add form in Todo App task manager area: heading, title label, input, helper text, validation error, and `Add task` submit button.
- Touch task list only enough to append newly created incomplete task immediately after save succeeds.
- New task row uses Todo item open variant: unchecked completion control placeholder may be present but does not need working toggle in this story; delete control may be present but does not need working delete in this story.
- Use native `form`, `label`, `input`, and `button` elements with visible keyboard focus.
- Error copy follows design system pattern near field: direct instruction tied to field.
- Pending create state may disable submit or show concise status while save is in progress; final UI must avoid duplicate pending create requests.

## Acceptance criteria

1. Given Visitor opens Todo App page, when initial render completes, then page shows clear heading, labelled task title input, helper text, and submit action.
2. Given Visitor enters `Buy milk`, when Visitor submits form, then system creates an incomplete task titled `Buy milk` and shows it in visible list without full page reload.
3. Given Visitor enters `  Buy milk  `, when Visitor submits form, then visible task title is `Buy milk`.
4. Given Visitor submits empty title or whitespace-only title, when validation runs, then inline error appears near input, focus returns to title input, no task is created, and existing visible list stays unchanged.
5. Given trimmed title is 1 character, when Visitor submits form, then task is accepted and shown as incomplete.
6. Given trimmed title is 120 characters, when Visitor submits form, then task is accepted and shown as incomplete.
7. Given trimmed title is 121 characters, when Visitor submits form, then inline error names the 120-character limit, no task is saved, and existing visible list stays unchanged.
8. Given Visitor adds a valid task and save succeeds, when form returns to ready state, then title input is cleared.
9. Given Visitor adds a valid task and save succeeds, when form returns to ready state, then focus is on the title input or another control useful for adding the next task.
10. Given Visitor focus is in the title input with a valid title, when Visitor presses Enter, then valid task is submitted.
11. Given Visitor uses keyboard only, when Visitor tabs through input and submit action, then each control is reachable and has visible focus.
12. Given another task already has the same title, when Visitor submits matching valid title, then new duplicate task is accepted and appears as a separate incomplete task.
13. Given create request is in progress, when Visitor activates submit again before first save returns, then app prevents duplicate pending submissions for that form action.
14. Given create save fails because persistence layer is unavailable, when error is returned, then error message appears, task is not shown as saved, and input text remains available for retry.
15. Given Visitor attempts add action, when no sign-in exists, then action is permitted.

## Dependencies

- Depends on project shell and one-page Todo App layout from approved design.
- Depends on backend create-task API and PostgreSQL persistence from architecture/service design for final saved behaviour.
- Can build UI with mock create response during Story UI stage; backend replaces mock during Story BE stage.
- No external accounts, credentials, or provider setup needed.
- No blocking stakeholder questions.
