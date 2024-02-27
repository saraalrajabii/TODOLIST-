import create from "zustand";
import { v4 as uuidv4 } from "uuid";

import { Todo } from "./model/Todo";

interface TodoState {
  todos: Todo[];
  addTodo: (description: string) => void;
  removeTodo: (id: string) => void;
  updateToDo: (id: string, title: string) => void;
  toggleCompletedState: (id: string) => void;
}

export const useStore = create<TodoState>((set, get) => ({
  // initial state
  todos: [],
  addTodo: (description: string) => {
    set((state) => ({
      todos: [
        ...state.todos,
        {
          id: uuidv4(),
          description,
          completed: false,
        } as Todo,
      ],
    }));
  },
  removeTodo: (id) => {
    set((state) => ({
      todos: state.todos.filter((todo) => todo.id !== id),
    }));
  },
  updateToDo: (id: string, description: string) => {
    const { todos } = get();
    set({
      todos: todos.map(todo =>({
        ...todo,
        description: todo.id === id ? description : todo.description
      }))
    })

 
  } , 
  toggleCompletedState: (id) => {
    set((state) => ({
      todos: state.todos.map((todo) =>
        todo.id === id
          ? ({ ...todo, completed: !todo.completed } as Todo)
          : todo
      ),
    }));
  },
}));
