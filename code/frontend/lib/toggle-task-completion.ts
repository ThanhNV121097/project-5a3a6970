import {
  buildToggleTaskCompletionSuccess,
  toggleTaskCompletionEmptyResponse,
  toggleTaskCompletionErrorResponse,
  toggleTaskCompletionInitialResponse,
  type TodoTask,
} from './mock/toggle-task-completion';

export type { TodoTask };

export type ViewState = 'default' | 'loading' | 'empty' | 'error';

export function loadToggleTaskCompletionTasks(state: ViewState) {
  if (state === 'empty') return toggleTaskCompletionEmptyResponse;
  return toggleTaskCompletionInitialResponse;
}

export function getToggleTaskCompletionErrorMessage() {
  return toggleTaskCompletionErrorResponse.error.message;
}

export function saveToggleTaskCompletion(task: TodoTask, isCompleted: boolean) {
  return buildToggleTaskCompletionSuccess(task, isCompleted);
}
