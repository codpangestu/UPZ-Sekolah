import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ---- Tasbih ----
interface TasbihState {
  counter: number;
  target: number;
  history: number[];
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  setTarget: (target: number) => void;
}

export const useTasbihStore = create<TasbihState>()(
  persist(
    (set) => ({
      counter: 0,
      target: 33,
      history: [],
      increment: () =>
        set((state) => ({
          counter: state.counter + 1,
          history:
            (state.counter + 1) % 100 === 0
              ? [...state.history, state.counter + 1]
              : state.history,
        })),
      decrement: () =>
        set((state) => ({
          counter: Math.max(0, state.counter - 1),
        })),
      reset: () => set({ counter: 0 }),
      setTarget: (target) => set({ target }),
    }),
    { name: 'menara-tasbih-storage', partialize: (state) => ({ counter: state.counter, target: state.target, history: state.history }) }
  )
);

// ---- Todo List ----
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

interface TodoState {
  todos: Todo[];
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  editTodo: (id: string, text: string) => void;
  clearCompleted: () => void;
}

export const useTodoStore = create<TodoState>()(
  persist(
    (set) => ({
      todos: [],
      addTodo: (text) =>
        set((state) => ({
          todos: [
            ...state.todos,
            {
              id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2),
              text,
              completed: false,
              createdAt: new Date().toISOString(),
            },
          ],
        })),
      toggleTodo: (id) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
          ),
        })),
      deleteTodo: (id) =>
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
        })),
      editTodo: (id, text) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, text } : todo
          ),
        })),
      clearCompleted: () =>
        set((state) => ({
          todos: state.todos.filter((todo) => !todo.completed),
        })),
    }),
    { name: 'menara-todo-storage' }
  )
);
