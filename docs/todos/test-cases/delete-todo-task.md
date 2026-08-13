# Test Cases — Delete todo task

Module: `todos`
Function: Delete todo task
Requirement: TODOS-004 — Delete saved task
Risk level: Medium. Deletion writes persistence and removes data immediately, so cases cover required success, accessibility, persistence, pending, and named failure behaviours.

## Automated cases

**Scenario**: AC-1 — Deleted task disappears from list
**Given**: Visitor is on the Todo App page and task `Buy milk` exists in the list
**When**: Visitor activates `Buy milk` delete control
**Then**: Task `Buy milk` disappears from the visible list without a full page reload

**Scenario**: AC-2 — Deleted task stays absent after reload
**Given**: Task `Buy milk` was deleted and delete save succeeded
**When**: Visitor refreshes the browser
**Then**: Task `Buy milk` does not appear in the list

**Scenario**: AC-3 — Keyboard visitor can run delete action
**Given**: Visitor uses keyboard only and task `Buy milk` exists in the list
**When**: Visitor focuses `Buy milk` delete control and presses Enter or Space
**Then**: Delete action runs and task `Buy milk` disappears from the visible list

**Scenario**: AC-4 — Empty state appears after deleting only task
**Given**: Task `Buy milk` is the only task in the list
**When**: Visitor activates `Buy milk` delete control and delete succeeds
**Then**: Task `Buy milk` disappears and the list area shows the empty state

**Scenario**: AC-5 — Deleting one task leaves other tasks unchanged
**Given**: Tasks `Buy milk` incomplete and `Walk dog` complete exist in the list
**When**: Visitor activates `Buy milk` delete control
**Then**: Task `Buy milk` disappears, task `Walk dog` remains visible, and task `Walk dog` remains complete

**Scenario**: AC-6 — Delete in progress shows pending protection
**Given**: Task `Buy milk` exists and its delete request is in progress
**When**: Visitor views the `Buy milk` task row
**Then**: `Buy milk` delete control shows pending feedback or is disabled until the delete result is known

**Scenario**: Failure — Task already gone when delete is requested
**Given**: Task `Buy milk` appears in the list but no longer exists in persistence when delete is requested
**When**: Visitor activates `Buy milk` delete control
**Then**: Task `Buy milk` is removed from the list or the list reloads, and no duplicate error blocks the visitor

**Scenario**: Permission — Visitor may delete without sign-in
**Given**: Visitor is not signed in and task `Buy milk` exists in the list
**When**: Visitor activates `Buy milk` delete control
**Then**: Delete action is permitted and task `Buy milk` disappears when delete succeeds

**Scenario**: Failure — Persistence unavailable during delete
**Given**: Task `Buy milk` exists in the list and the persistence layer is unavailable
**When**: Visitor activates `Buy milk` delete control
**Then**: Task `Buy milk` remains visible and an error message explains the delete was not saved

**Scenario**: Failure — Repeated delete activation is blocked
**Given**: Task `Buy milk` exists and its first delete request is still in progress
**When**: Visitor rapidly activates `Buy milk` delete control again
**Then**: App sends no duplicate delete request for `Buy milk` and keeps pending feedback or disabled state until the first result is known

**Scenario**: Scope — Delete happens immediately without confirmation
**Given**: Task `Buy milk` exists in the list
**When**: Visitor activates `Buy milk` delete control
**Then**: App does not require a confirmation step and starts deleting `Buy milk` immediately

## Manual cases

None. Required delete behaviour is observable through UI state, persistence reload, keyboard interaction, and request control.

## Coverage check

- AC-1 covered by `AC-1 — Deleted task disappears from list`.
- AC-2 covered by `AC-2 — Deleted task stays absent after reload`.
- AC-3 covered by `AC-3 — Keyboard visitor can run delete action`.
- AC-4 covered by `AC-4 — Empty state appears after deleting only task`.
- AC-5 covered by `AC-5 — Deleting one task leaves other tasks unchanged`.
- AC-6 covered by `AC-6 — Delete in progress shows pending protection`.
- Named failure and behaviour cases covered: not found, not permitted, upstream failure, repeated delete, accidental delete.
