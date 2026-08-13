# Test Cases — Toggle task completion

Module: `todos`
Function: Toggle task completion
Requirement: TODOS-003 — Mark task complete or incomplete
Risk level: Medium. This function updates persisted data and has accessibility/pending/failure states, but no auth or payment risk.

## Automated test cases

**Scenario**: Incomplete task toggles to complete
**Given**: Visitor is on the Todo App page and task `Buy milk` is visible as incomplete
**When**: Visitor activates `Buy milk` completion control
**Then**: `Buy milk` appears complete in the list
Trace: TODOS-003 AC-1

**Scenario**: Complete task toggles to incomplete
**Given**: Visitor is on the Todo App page and task `Buy milk` is visible as complete
**When**: Visitor activates `Buy milk` completion control
**Then**: `Buy milk` appears incomplete in the list
Trace: TODOS-003 AC-2

**Scenario**: Changed completion state survives reload
**Given**: Visitor changed task `Buy milk` from incomplete to complete and save succeeded
**When**: Visitor refreshes the browser
**Then**: `Buy milk` still appears complete after reload
Trace: TODOS-003 AC-3

**Scenario**: Keyboard toggles completion state
**Given**: Visitor uses keyboard only and focus is on `Buy milk` completion control
**When**: Visitor presses Space or Enter
**Then**: `Buy milk` completion state toggles from its previous state
Trace: TODOS-003 AC-4

**Scenario**: Complete state is visible and exposed to assistive technology
**Given**: Task `Buy milk` appears complete and task `Call Sam` appears incomplete
**When**: Visitor views the task list
**Then**: `Buy milk` has a visual complete state that differs from `Call Sam`, and `Buy milk` completion control exposes its complete state to assistive technology
Trace: TODOS-003 AC-5

**Scenario**: Toggle save in progress shows pending feedback
**Given**: Visitor activated `Buy milk` completion control and toggle save has not completed
**When**: Visitor views the `Buy milk` task row
**Then**: `Buy milk` completion control shows pending feedback or is disabled until save result is known
Trace: TODOS-003 AC-6

**Scenario**: Toggle action is permitted for visitor
**Given**: Visitor is on the Todo App page with task `Buy milk` visible
**When**: Visitor activates `Buy milk` completion control
**Then**: Toggle request is allowed without sign-in and task completion state changes when save succeeds
Trace: TODOS-003 failure/permission behaviour — Not permitted

**Scenario**: Missing task during toggle is handled
**Given**: Task `Buy milk` is visible, but the task no longer exists in persistence
**When**: Visitor activates `Buy milk` completion control
**Then**: `Buy milk` is removed from the list or the list reloads, and a message explains the task is no longer available
Trace: TODOS-003 failure behaviour — Not found

**Scenario**: Persistence failure reverts visible state
**Given**: Task `Buy milk` is visible as incomplete
**When**: Visitor activates `Buy milk` completion control and persistence layer is unavailable
**Then**: `Buy milk` returns to incomplete state, and an error message explains the change was not saved
Trace: TODOS-003 failure behaviour — Upstream failure

**Scenario**: Repeated toggle does not desync visible and persisted state
**Given**: Task `Buy milk` is visible as incomplete
**When**: Visitor rapidly activates `Buy milk` completion control multiple times before first toggle save completes
**Then**: App serializes or disables toggles so final visible state matches the persisted completion state
Trace: TODOS-003 failure behaviour — Repeated toggle

**Scenario**: Conflict resolves to last successful saved state
**Given**: Task `Buy milk` is visible and the same task is changed in another browser before this toggle completes
**When**: Visitor reloads the page or retries after the conflict
**Then**: `Buy milk` shows the last successful saved completion state
Trace: TODOS-003 failure behaviour — Conflict

## Manual test cases

None. All required toggle behaviours are observable through UI state, persistence state after reload, keyboard interaction, and accessibility tree checks.

## Coverage self-check

- AC-1 covered by `Incomplete task toggles to complete`.
- AC-2 covered by `Complete task toggles to incomplete`.
- AC-3 covered by `Changed completion state survives reload`.
- AC-4 covered by `Keyboard toggles completion state`.
- AC-5 covered by `Complete state is visible and exposed to assistive technology`.
- AC-6 covered by `Toggle save in progress shows pending feedback`.
- Failure/permission behaviours covered: Not found, Not permitted, Conflict, Upstream failure, Repeated toggle.
