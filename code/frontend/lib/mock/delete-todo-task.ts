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

export type ApiErrorResponse = {
  error: {
    code: 'BAD_REQUEST' | 'RATE_LIMITED' | 'INTERNAL' | 'UNAVAILABLE';
    message: string;
    details: Array<{ field: string; code: string; message: string }>;
    request_id: string;
  };
};

const initialTodos: TodoListResponse = {
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
      title: 'Walk dog',
      is_completed: true,
      created_at: '2026-08-13T09:30:00Z',
      updated_at: '2026-08-13T09:45:00Z',
    },
  ],
  next_cursor: null,
  has_more: false,
};

export function getDeleteTodoMockList(): TodoListResponse {
  return {
    ...initialTodos,
    tasks: initialTodos.tasks.map((task) => ({ ...task })),
  };
}

export async function deleteTodoMock(todoId: string, shouldFail: boolean): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 350));

  if (shouldFail) {
    const error: ApiErrorResponse = {
      error: {
        code: 'UNAVAILABLE',
        message: 'Delete was not saved. Try again.',
        details: [],
        request_id: '01HXDELETE0000000000000000',
      },
    };
    throw error;
  }

  void todoId;
}
