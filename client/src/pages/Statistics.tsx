/**
 * Página de Estatísticas com gráficos e análises de produtividade
 * Exibe métricas de tarefas, gráficos de distribuição e tendências
 */

import React from "react";
import { useTaskContext } from "@/contexts/TaskContext";
import { useStatistics } from "@/hooks/useStatistics";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Statistics: React.FC = () => {
  const { state } = useTaskContext();
  const { tasks, categories } = state;
  const stats = useStatistics(tasks, categories);

  // Dados para gráfico de prioridades
  const priorityData = [
    { name: "Urgente", value: stats.tasksByPriority.urgent, fill: "#FF6B6B" },
    { name: "Alta", value: stats.tasksByPriority.high, fill: "#FFA07A" },
    { name: "Média", value: stats.tasksByPriority.medium, fill: "#F7DC6F" },
    { name: "Baixa", value: stats.tasksByPriority.low, fill: "#98D8C8" },
  ];

  // Dados para gráfico de categorias
  const categoryData = categories
    .filter((cat) => stats.tasksByCategory[cat.id] > 0)
    .map((cat) => ({
      name: cat.name,
      value: stats.tasksByCategory[cat.id],
      fill: cat.color,
    }));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="space-y-6 p-6">
      {/* Título */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Estatísticas</h1>
        <p className="text-muted-foreground">Análise de produtividade e desempenho</p>
      </div>

      {/* Cards de Métricas */}
      <motion.div
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Total de Tarefas */}
        <motion.div variants={itemVariants}>
          <Card className="p-6">
            <div className="text-sm font-medium text-muted-foreground">Total de Tarefas</div>
            <div className="mt-2 text-3xl font-bold text-foreground">{stats.totalTasks}</div>
            <div className="mt-1 text-xs text-muted-foreground">Todas as tarefas criadas</div>
          </Card>
        </motion.div>

        {/* Tarefas Concluídas */}
        <motion.div variants={itemVariants}>
          <Card className="p-6">
            <div className="text-sm font-medium text-muted-foreground">Concluídas</div>
            <div className="mt-2 text-3xl font-bold text-green-600">{stats.completedTasks}</div>
            <div className="mt-1 text-xs text-muted-foreground">
              {stats.totalTasks > 0 ? Math.round(stats.completionRate) : 0}% de conclusão
            </div>
          </Card>
        </motion.div>

        {/* Tarefas Atrasadas */}
        <motion.div variants={itemVariants}>
          <Card className="p-6">
            <div className="text-sm font-medium text-muted-foreground">Atrasadas</div>
            <div className="mt-2 text-3xl font-bold text-destructive">{stats.overdueTasks}</div>
            <div className="mt-1 text-xs text-muted-foreground">Precisam de atenção</div>
          </Card>
        </motion.div>

        {/* Média por Dia */}
        <motion.div variants={itemVariants}>
          <Card className="p-6">
            <div className="text-sm font-medium text-muted-foreground">Média/Dia</div>
            <div className="mt-2 text-3xl font-bold text-primary">
              {stats.averageTasksPerDay.toFixed(1)}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">Tarefas criadas por dia</div>
          </Card>
        </motion.div>
      </motion.div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Gráfico de Prioridades */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6">
            <h2 className="mb-4 text-lg font-semibold text-foreground">Distribuição por Prioridade</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Gráfico de Categorias */}
        {categoryData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6">
              <h2 className="mb-4 text-lg font-semibold text-foreground">Tarefas por Categoria</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" radius={[8, 8, 0, 0]}>
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Taxa de Conclusão */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Taxa de Conclusão</h2>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="h-4 rounded-full bg-muted overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.completionRate}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            </div>
            <div className="text-3xl font-bold text-foreground">
              {Math.round(stats.completionRate)}%
            </div>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {stats.completedTasks} de {stats.totalTasks} tarefas concluídas
          </p>
        </Card>
      </motion.div>
    </div>
  );
};

export default Statistics;
