/**
 * Utilitários para persistência de dados no LocalStorage
 * Inclui serialização/desserialização com suporte a datas
 */

import { AppState, Task, Category, Tag } from "@/types";

const STORAGE_KEY = "todo-app-pro-state";

// Reviver para converter strings de data em objetos Date
const dateReviver = (_key: string, value: unknown) => {
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
    return new Date(value);
  }
  return value;
};

// Replacer para converter objetos Date em strings ISO
const dateReplacer = (_key: string, value: unknown) => {
  if (value instanceof Date) {
    return value.toISOString();
  }
  return value;
};

export const storage = {
  /**
   * Salva o estado completo da aplicação no LocalStorage
   */
  saveState: (state: AppState): void => {
    try {
      const serialized = JSON.stringify(state, dateReplacer);
      localStorage.setItem(STORAGE_KEY, serialized);
    } catch (error) {
      console.error("Erro ao salvar estado:", error);
    }
  },

  /**
   * Carrega o estado completo da aplicação do LocalStorage
   */
  loadState: (): AppState | null => {
    try {
      const serialized = localStorage.getItem(STORAGE_KEY);
      if (!serialized) return null;
      return JSON.parse(serialized, dateReviver) as AppState;
    } catch (error) {
      console.error("Erro ao carregar estado:", error);
      return null;
    }
  },

  /**
   * Limpa o estado do LocalStorage
   */
  clearState: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Erro ao limpar estado:", error);
    }
  },

  /**
   * Exporta dados como JSON para download
   */
  exportAsJSON: (state: AppState): string => {
    return JSON.stringify(state, dateReplacer, 2);
  },

  /**
   * Importa dados de um arquivo JSON
   */
  importFromJSON: (jsonString: string): AppState | null => {
    try {
      return JSON.parse(jsonString, dateReviver) as AppState;
    } catch (error) {
      console.error("Erro ao importar JSON:", error);
      return null;
    }
  },
};
