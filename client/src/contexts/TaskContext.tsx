/**
 * Context API para gerenciamento de estado global do To-Do App
 * Centraliza todas as operações de tarefas, categorias e filtros
 */

import React, { createContext, useContext, useReducer, useEffect, useCallback } from "react";
import { Task, Category, Tag, TaskFilter, AppState, Priority } from "@/types";
import { storage } from "@/lib/storage";
import { getDefaultAppState, getEmptyAppState } from "@/lib/defaultData";
import { nanoid } from "nanoid";

type TaskAction =
  | { type: "INIT_STATE"; payload: AppState }
  | { type: "ADD_TASK"; payload: Task }
  | { type: "UPDATE_TASK"; payload: Task }
  | { type: "DELETE_TASK"; payload: string }
  | { type: "TOGGLE_TASK"; payload: string }
  | { type: "ADD_CATEGORY"; payload: Category }
  | { type: "UPDATE_CATEGORY"; payload: Category }
  | { type: "DELETE_CATEGORY"; payload: string }
  | { type: "ADD_TAG"; payload: Tag }
  | { type: "DELETE_TAG"; payload: string }
  | { type: "SET_FILTERS"; payload: TaskFilter }
  | { type: "SET_VIEW_MODE"; payload: "list" | "kanban" | "calendar" }
  | { type: "TOGGLE_DARK_MODE" }
  | { type: "RESET_STATE" };

interface TaskContextType {
  state: AppState;
  dispatch: React.Dispatch<TaskAction>;
  // Task operations
  addTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  // Category operations
  addCategory: (category: Omit<Category, "id" | "createdAt">) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
  // Tag operations
  addTag: (tag: Omit<Tag, "id">) => void;
  deleteTag: (id: string) => void;
  // Filter operations
  setFilters: (filters: TaskFilter) => void;
  // View operations
  setViewMode: (mode: "list" | "kanban" | "calendar") => void;
  toggleDarkMode: () => void;
  resetState: () => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const taskReducer = (state: AppState, action: TaskAction): AppState => {
  switch (action.type) {
    case "INIT_STATE":
      return action.payload;

    case "ADD_TASK":
      return { ...state, tasks: [...state.tasks, action.payload] };

    case "UPDATE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((t) => (t.id === action.payload.id ? action.payload : t)),
      };

    case "DELETE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter((t) => t.id !== action.payload),
      };

    case "TOGGLE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload ? { ...t, completed: !t.completed, updatedAt: new Date() } : t
        ),
      };

    case "ADD_CATEGORY":
      return { ...state, categories: [...state.categories, action.payload] };

    case "UPDATE_CATEGORY":
      return {
        ...state,
        categories: state.categories.map((c) => (c.id === action.payload.id ? action.payload : c)),
      };

    case "DELETE_CATEGORY":
      return {
        ...state,
        categories: state.categories.filter((c) => c.id !== action.payload),
        tasks: state.tasks.filter((t) => t.categoryId !== action.payload),
      };

    case "ADD_TAG":
      return { ...state, tags: [...state.tags, action.payload] };

    case "DELETE_TAG":
      return {
        ...state,
        tags: state.tags.filter((t) => t.id !== action.payload),
        tasks: state.tasks.map((task) => ({
          ...task,
          tags: task.tags.filter((t) => t.id !== action.payload),
        })),
      };

    case "SET_FILTERS":
      return { ...state, filters: action.payload };

    case "SET_VIEW_MODE":
      return { ...state, viewMode: action.payload };

    case "TOGGLE_DARK_MODE":
      return { ...state, isDarkMode: !state.isDarkMode };

    case "RESET_STATE":
      return getEmptyAppState();

    default:
      return state;
  }
};

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, getDefaultAppState());

  // Carregar estado do localStorage ao montar
  useEffect(() => {
    const savedState = storage.loadState();
    if (savedState) {
      dispatch({ type: "INIT_STATE", payload: savedState });
    }
  }, []);

  // Salvar estado no localStorage quando mudar
  useEffect(() => {
    storage.saveState(state);
  }, [state]);

  const addTask = useCallback(
    (taskData: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
      const newTask: Task = {
        ...taskData,
        id: nanoid(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      dispatch({ type: "ADD_TASK", payload: newTask });
    },
    []
  );

  const updateTask = useCallback((task: Task) => {
    dispatch({ type: "UPDATE_TASK", payload: { ...task, updatedAt: new Date() } });
  }, []);

  const deleteTask = useCallback((id: string) => {
    dispatch({ type: "DELETE_TASK", payload: id });
  }, []);

  const toggleTask = useCallback((id: string) => {
    dispatch({ type: "TOGGLE_TASK", payload: id });
  }, []);

  const addCategory = useCallback((categoryData: Omit<Category, "id" | "createdAt">) => {
    const newCategory: Category = {
      ...categoryData,
      id: nanoid(),
      createdAt: new Date(),
    };
    dispatch({ type: "ADD_CATEGORY", payload: newCategory });
  }, []);

  const updateCategory = useCallback((category: Category) => {
    dispatch({ type: "UPDATE_CATEGORY", payload: category });
  }, []);

  const deleteCategory = useCallback((id: string) => {
    dispatch({ type: "DELETE_CATEGORY", payload: id });
  }, []);

  const addTag = useCallback((tagData: Omit<Tag, "id">) => {
    const newTag: Tag = {
      ...tagData,
      id: nanoid(),
    };
    dispatch({ type: "ADD_TAG", payload: newTag });
  }, []);

  const deleteTag = useCallback((id: string) => {
    dispatch({ type: "DELETE_TAG", payload: id });
  }, []);

  const setFilters = useCallback((filters: TaskFilter) => {
    dispatch({ type: "SET_FILTERS", payload: filters });
  }, []);

  const setViewMode = useCallback((mode: "list" | "kanban" | "calendar") => {
    dispatch({ type: "SET_VIEW_MODE", payload: mode });
  }, []);

  const toggleDarkMode = useCallback(() => {
    dispatch({ type: "TOGGLE_DARK_MODE" });
  }, []);

  const resetState = useCallback(() => {
    dispatch({ type: "RESET_STATE" });
  }, []);

  const value: TaskContextType = {
    state,
    dispatch,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    addCategory,
    updateCategory,
    deleteCategory,
    addTag,
    deleteTag,
    setFilters,
    setViewMode,
    toggleDarkMode,
    resetState,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

/**
 * Hook para usar o contexto de tarefas
 */
export const useTaskContext = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTaskContext deve ser usado dentro de TaskProvider");
  }
  return context;
};
