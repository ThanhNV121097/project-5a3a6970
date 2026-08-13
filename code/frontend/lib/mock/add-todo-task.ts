export type TodoTask = {
  id: string;
  title: string;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
};

export type CreateTodoRequest = {
  title: string;
};

export type TodoErrorResponse = {
  error: {
    code: 'BAD_REQUEST' | 'VALIDATION_FAILED' | 'RATE_LIMITED' | 'INTERNAL' | 'UNAVAILABLE';
    message: string;
    details: Array<{ field: string; code: string; message: string }>;
    request_id: string;
  };
};

export const initialTodosResponse: { tasks: TodoTask[]; next_cursor: null; has_more: false } = {
  tasks: [],
  next_cursor: null,
  has_more: false,
};

export async function createTodoMock(body: CreateTodoRequest): Promise<TodoTask> {
  const title = body.title.trim();

  await new Promise((resolve) => setTimeout(resolve, 350));

  if (title.toLowerCase() === 'fail') {
    const response: TodoErrorResponse = {
      error: {
        code: 'UNAVAILABLE',
        message: 'Could not save task. Try again.',
        details: [],
        request_id: 'mock-request-id',
      },
    };
    throw response;
  }

  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    title,
    is_completed: false,
    created_at: now,
    updated_at: now,
  };
}
