# Test cases — Add todo task

Module: `todos`
Function: Add todo task
Requirement: TODOS-001 — Add task by title
Risk level: Medium. This function writes persisted user data and has validation, accessibility, and failure states, but no authentication or external service integration.

## Automated test cases

**Scenario**: AC-1 — Initial page shows add-task controls
**Given**: Visitor is on the Todo App page with task list load complete
**When**: Page finishes initial render
**Then**: Page shows one clear page heading, one labelled title input, and one submit action with accessible names.
Trace: TODOS-001 AC-1

**Scenario**: AC-2 — Submit valid title adds incomplete task without reload
**Given**: Visitor entered `Buy milk` in the title input and current page instance has not reloaded
**When**: Visitor submits the form
**Then**: List shows a new task titled `Buy milk`, task state is incomplete, and browser page load count or current document instance is unchanged.
Trace: TODOS-001 AC-2

**Scenario**: AC-3 — Title is trimmed before save
**Given**: Visitor entered `  Buy milk  ` in the title input
**When**: Visitor submits the form
**Then**: List shows a task titled exactly `Buy milk`, with no leading or trailing spaces.
Trace: TODOS-001 AC-3

**Scenario**: AC-4 — Successful add clears input
**Given**: Visitor added a valid task titled `Buy milk`
**When**: Save succeeds
**Then**: Title input value is empty.
Trace: TODOS-001 AC-4

**Scenario**: AC-5 — Enter key submits valid task
**Given**: Visitor focus is on the title input and input value is `Buy milk`
**When**: Visitor presses Enter
**Then**: List shows a new incomplete task titled `Buy milk`.
Trace: TODOS-001 AC-5

**Scenario**: AC-6 — Keyboard-only user can reach input and submit action
**Given**: Visitor uses keyboard only and focus starts before the add-task form
**When**: Visitor tabs through the title input and submit action
**Then**: Title input and submit action each receive focus, each focused control has visible focus indication, and no pointer action is required.
Trace: TODOS-001 AC-6

**Scenario**: Invalid input — Empty title is rejected
**Given**: Existing list contains task `Buy milk` and title input is empty
**When**: Visitor submits the form
**Then**: Inline error appears near the title input, no new task is added, and existing list still contains only the original `Buy milk` task.
Trace: TODOS-001 failure behaviour — Invalid input

**Scenario**: Invalid input — Whitespace-only title is rejected after trim
**Given**: Existing list contains task `Buy milk` and visitor entered `   ` in the title input
**When**: Visitor submits the form
**Then**: Inline error appears near the title input, no new task is added, and existing list still contains only the original `Buy milk` task.
Trace: TODOS-001 behaviour 3; failure behaviour — Invalid input

**Scenario**: Boundary — One-character trimmed title is accepted
**Given**: Visitor entered ` A ` in the title input
**When**: Visitor submits the form
**Then**: List shows a new incomplete task titled exactly `A`.
Trace: TODOS-001 boundary — trimmed title length 1

**Scenario**: Boundary — 120-character trimmed title is accepted
**Given**: Visitor entered a title whose trimmed value is exactly 120 characters
**When**: Visitor submits the form
**Then**: List shows a new incomplete task with the exact 120-character title.
Trace: TODOS-001 boundary — trimmed title length 120

**Scenario**: Boundary — 121-character trimmed title is rejected
**Given**: Existing list contains task `Buy milk` and visitor entered a title whose trimmed value is exactly 121 characters
**When**: Visitor submits the form
**Then**: Inline error near the title input names the 120-character limit, no new task is added, and existing list remains unchanged.
Trace: TODOS-001 boundary — trimmed title length 121

**Scenario**: Duplicate title is allowed
**Given**: Existing list contains task `Buy milk` and visitor entered `Buy milk` in the title input
**When**: Visitor submits the form
**Then**: List shows two separate tasks titled `Buy milk`.
Trace: TODOS-001 failure, boundary and permission behaviour — Duplicate title

**Scenario**: Visitor add action is permitted without sign-in
**Given**: Visitor is not signed in because no sign-in exists in scope, and title input value is `Buy milk`
**When**: Visitor submits the form
**Then**: Add action is accepted and list shows a new incomplete task titled `Buy milk`.
Trace: TODOS-001 permission behaviour — Not permitted case states action is permitted

**Scenario**: Persistence failure keeps input available for retry
**Given**: Visitor entered `Buy milk` in the title input and persistence layer is unavailable
**When**: Visitor submits the form
**Then**: Error message appears near the add form, task `Buy milk` is not shown as saved in the list, and title input still contains `Buy milk` or otherwise offers the same text for retry without retyping.
Trace: TODOS-001 failure behaviour — Upstream failure

**Scenario**: Rapid repeat submit does not create duplicate pending tasks
**Given**: Visitor entered `Buy milk` in the title input and first save request is still pending
**When**: Visitor submits the same form action multiple times before the first save returns
**Then**: App sends or accepts only one pending add for that form action and list does not show duplicate pending `Buy milk` tasks.
Trace: TODOS-001 failure behaviour — Rapid repeat submit

**Scenario**: Successful add returns focus to add-task workflow
**Given**: Visitor focus was on the title input and visitor submitted valid title `Buy milk`
**When**: Save succeeds
**Then**: Focus is on the title input or submit action, allowing another task to be added by keyboard without pointer interaction.
Trace: TODOS-001 behaviour 6

**Scenario**: Validation error is exposed to assistive technology
**Given**: Visitor uses assistive technology and title input is empty
**When**: Visitor submits the form
**Then**: Validation error is programmatically associated with or announced near the title input.
Trace: TODOS-001 failure behaviour — Invalid input; Non-functional accessibility

## Manual test cases

None. All stated acceptance criteria and failure behaviours for Add todo task are observable through UI automation, API/network stubbing, DOM focus checks, and accessibility-tree assertions.
