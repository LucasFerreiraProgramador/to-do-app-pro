/**
 * Dados iniciais padrão para o To-Do App
 * Inclui categorias, tags e tarefas de exemplo
 */

import { Category, Tag, Task, AppState } from "@/types";

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: "cat-1",
    name: "Trabalho",
    color: "#FF6B6B",
    description: "Tarefas relacionadas ao trabalho",
    createdAt: new Date(),
  },
  {
    id: "cat-2",
    name: "Pessoal",
    color: "#4ECDC4",
    description: "Tarefas pessoais e atividades",
    createdAt: new Date(),
  },
  {
    id: "cat-3",
    name: "Estudos",
    color: "#45B7D1",
    description: "Tarefas educacionais e aprendizado",
    createdAt: new Date(),
  },
  {
    id: "cat-4",
    name: "Saúde",
    color: "#FFA07A",
    description: "Atividades de saúde e bem-estar",
    createdAt: new Date(),
  },
];

export const DEFAULT_TAGS: Tag[] = [
  { id: "tag-1", name: "Urgente", color: "#FF6B6B" },
  { id: "tag-2", name: "Importante", color: "#FFA07A" },
  { id: "tag-3", name: "Projeto", color: "#45B7D1" },
  { id: "tag-4", name: "Reunião", color: "#F7DC6F" },
  { id: "tag-5", name: "Leitura", color: "#98D8C8" },
  { id: "tag-6", name: "Revisão", color: "#BB8FCE" },
];

export const DEFAULT_TASKS: Task[] = [
  {
    id: "task-1",
    title: "Revisar proposta de projeto",
    description: "Analisar a proposta enviada pelo cliente e preparar feedback",
    categoryId: "cat-1",
    priority: "high",
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    completed: false,
    tags: [DEFAULT_TAGS[2], DEFAULT_TAGS[1]],
    subtasks: [
      { id: "sub-1", title: "Ler documento completo", completed: true, createdAt: new Date() },
      { id: "sub-2", title: "Fazer anotações", completed: false, createdAt: new Date() },
      { id: "sub-3", title: "Preparar apresentação", completed: false, createdAt: new Date() },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "task-2",
    title: "Estudar React Hooks",
    description: "Aprofundar conhecimento em useEffect e useContext",
    categoryId: "cat-3",
    priority: "medium",
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    completed: false,
    tags: [DEFAULT_TAGS[4]],
    subtasks: [
      { id: "sub-4", title: "Assistir tutoriais", completed: true, createdAt: new Date() },
      { id: "sub-5", title: "Fazer exercícios práticos", completed: false, createdAt: new Date() },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "task-3",
    title: "Agendar consulta médica",
    description: "Marcar consulta com o cardiologista",
    categoryId: "cat-4",
    priority: "medium",
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    completed: false,
    tags: [],
    subtasks: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "task-4",
    title: "Responder emails pendentes",
    description: "Responder todos os emails não respondidos da semana",
    categoryId: "cat-1",
    priority: "low",
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    completed: true,
    tags: [],
    subtasks: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "task-5",
    title: "Fazer exercício físico",
    description: "30 minutos de corrida ou academia",
    categoryId: "cat-4",
    priority: "low",
    dueDate: new Date(),
    completed: false,
    tags: [],
    subtasks: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const getDefaultAppState = (): AppState => ({
  tasks: DEFAULT_TASKS,
  categories: DEFAULT_CATEGORIES,
  tags: DEFAULT_TAGS,
  filters: {
    categories: [],
    priorities: [],
    tags: [],
    searchQuery: "",
    showCompleted: true,
  },
  viewMode: "list",
  isDarkMode: false,
});

/**
 * Retorna um estado vazio (sem tarefas)
 * Usado quando o usuário clica em "Resetar"
 */
export const getEmptyAppState = (): AppState => ({
  tasks: [],
  categories: DEFAULT_CATEGORIES,
  tags: DEFAULT_TAGS,
  filters: {
    categories: [],
    priorities: [],
    tags: [],
    searchQuery: "",
    showCompleted: true,
  },
  viewMode: "list",
  isDarkMode: false,
});
