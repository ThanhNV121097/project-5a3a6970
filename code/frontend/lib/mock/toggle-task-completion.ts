export type TodoTask = {
  id: string;
  title: string;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
};

export type TodoListResponse = {
  tasks: TodoTask[];
  next_cursor: string | null;
  has_more: boolean;
};

export type TodoErrorResponse = {
  error: {
    code: 'BAD_REQUEST' | 'VALIDATION_FAILED' | 'NOT_FOUND' | 'RATE_LIMITED' | 'INTERNAL' | 'UNAVAILABLE';
    message: string;
    details: Array<{ field: string; code: string; message: string }>;
    request_id: string;
  };
};

export const toggleTaskCompletionInitialResponse: TodoListResponse = {
  tasks: [
    {
      id: '550e8400-e29b-41d4-a716-446655440000',
      title: 'Buy milk',
      is_completed: false,
      created_at: '2026-08-13T10:00:00Z',
      updated_at: '2026-08-13T10:00:00Z',
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440001',
      title: 'Call Sam',
      is_completed: true,
      created_at: '2026-08-13T09:30:00Z',
      updated_at: '2026-08-13T09:45:00Z',
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440002',
      title: 'Draft weekly plan',
      is_completed: false,
      created_at: '2026-08-13T09:00:00Z',
      updated_at: '2026-08-13T09:00:00Z',
    },
  ],
  next_cursor: null,
  has_more: false,
};

export const toggleTaskCompletionEmptyResponse: TodoListResponse = {
  tasks: [],
  next_cursor: null,
  has_more: false,
};

export const toggleTaskCompletionErrorResponse: TodoErrorResponse = {
  error: {
    code: 'UNAVAILABLE',
    message: 'Tasks are unavailable. Try again.',
    details: [],
    request_id: '01HX0000000000000000000000',
  },
};

export function buildToggleTaskCompletionSuccess(task: TodoTask, isCompleted: boolean): TodoTask {
  return {
    ...task,
    is_completed: isCompleted,
    updated_at: '2026-08-13T10:01:00Z',
  };
}
