# Test Cases — Persist and list tasks

Module: `todos`
Function: Persist and list tasks
Requirement: TODOS-002 — Load and show saved tasks
Risk level: Medium. This function reads persisted data and owns reload survival, ordering, empty, loading, and recoverable load failure states for the one-page app.

## Automated coverage

**Scenario**: Load saved tasks on page open
**Given**: Persistence contains incomplete task `Buy milk` and complete task `Pay rent`
**When**: Visitor opens the Todo App page
**Then**: List shows `Buy milk` as incomplete and `Pay rent` as complete from persistence
Trace: TODOS-002 AC-1

**Scenario**: Added task survives browser refresh
**Given**: Task `Buy milk` was added and save succeeded
**When**: Visitor refreshes the browser
**Then**: Page still shows task `Buy milk` in the list
Trace: TODOS-002 AC-2

**Scenario**: Empty state appears when no tasks exist
**Given**: Persistence contains zero tasks
**When**: Visitor opens the Todo App page
**Then**: List area shows clear empty state text and add form remains visible and usable
Trace: TODOS-002 AC-3; Empty data

**Scenario**: Loading state appears while tasks load
**Given**: Task load request is pending
**When**: Visitor views the list area
**Then**: List area shows a loading state until the request resolves
Trace: TODOS-002 AC-4

**Scenario**: Tasks display newest first
**Given**: Persistence contains task `Older task` created at `2026-08-13T10:00:00Z` and task `Newest task` created at `2026-08-13T11:00:00Z`
**When**: Visitor opens the Todo App page
**Then**: `Newest task` appears before `Older task`
Trace: TODOS-002 AC-5

**Scenario**: Complete state survives browser refresh
**Given**: Saved task `Pay rent` is complete
**When**: Visitor refreshes the browser
**Then**: Task `Pay rent` still appears complete
Trace: TODOS-002 AC-6

**Scenario**: Visitor may list tasks without sign-in
**Given**: Visitor is not signed in and saved tasks exist
**When**: Visitor opens the Todo App page
**Then**: Page loads and shows saved tasks; no sign-in prompt or permission error blocks list viewing
Trace: TODOS-002 Not permitted

**Scenario**: Load failure shows retry and preserves usable add form
**Given**: Persistence layer is unavailable during task loading
**When**: Visitor opens the Todo App page
**Then**: List area shows an error state with a retry action, and add form remains visible if safe to use
Trace: TODOS-002 Upstream failure

**Scenario**: Retry replaces load error after successful reload
**Given**: Task loading failed and retry action is visible
**When**: Visitor activates retry and persistence returns task `Buy milk`
**Then**: Error state is replaced by list containing `Buy milk`
Trace: TODOS-002 Retry

**Scenario**: Invalid persisted task is not rendered
**Given**: Persistence returns task `Valid task` with title and completion state, plus one task missing title or completion state
**When**: Visitor opens the Todo App page
**Then**: `Valid task` is shown, invalid task is not rendered, and error state explains list could not fully load
Trace: TODOS-002 Data integrity

**Scenario**: List handles 100 saved tasks at supported widths
**Given**: Persistence contains 100 saved tasks
**When**: Visitor opens the Todo App page at 320 px viewport width
**Then**: All 100 tasks are reachable in the list and page has no horizontal scroll
Trace: TODOS-002 Large list boundary; Non-functional responsive requirement

**Scenario**: Initial list load performance for 100 tasks
**Given**: Persistence contains 100 saved tasks and visitor uses a typical broadband connection
**When**: Visitor opens the Todo App page
**Then**: Initial task list load completes within 2 seconds
Trace: TODOS-002; Non-functional performance requirement

## Manual coverage

None. Required states, ordering, persistence, permissions, failure, retry, boundary, accessibility-visible error text, and responsive behavior are observable by automated browser or API-backed tests.
