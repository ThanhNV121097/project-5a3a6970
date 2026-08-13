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
    code: "BAD_REQUEST" | "RATE_LIMITED" | "INTERNAL" | "UNAVAILABLE";
    message: string;
    details: Array<{ field: string; code: string; message: string }>;
    request_id: string;
  };
};

export const persistAndListTasksMock: TodoListResponse = {
  tasks: [
    {
      id: "550e8400-e29b-41d4-a716-446655440002",
      title: "Review saved tasks",
      is_completed: false,
      created_at: "2026-08-13T11:00:00Z",
      updated_at: "2026-08-13T11:00:00Z",
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440001",
      title: "Pay rent",
      is_completed: true,
      created_at: "2026-08-13T10:00:00Z",
      updated_at: "2026-08-13T10:30:00Z",
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440000",
      title: "Buy milk",
      is_completed: false,
      created_at: "2026-08-13T09:00:00Z",
      updated_at: "2026-08-13T09:00:00Z",
    },
  ],
  next_cursor: null,
  has_more: false,
};

export const emptyPersistAndListTasksMock: TodoListResponse = {
  tasks: [],
  next_cursor: null,
  has_more: false,
};

export const invalidPersistAndListTasksMock: TodoListResponse = {
  tasks: [
    persistAndListTasksMock.tasks[0],
    {
      id: "550e8400-e29b-41d4-a716-446655440099",
      title: "",
      is_completed: false,
      created_at: "2026-08-13T08:00:00Z",
      updated_at: "2026-08-13T08:00:00Z",
    },
  ],
  next_cursor: null,
  has_more: false,
};

export const persistAndListTasksErrorMock: TodoErrorResponse = {
  error: {
    code: "UNAVAILABLE",
    message: "Could not load tasks.",
    details: [],
    request_id: "01HX0000000000000000000000",
  },
};
