"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Task {
  id: number;
  title: string;
  isCompleted: boolean;
  deadline: string | null;
}

interface Project {
  id: number;
  title: string;
  description: string | null;
  tasks: Task[];
}

export default function ProjectPage() {
  const params = useParams();
  const projectId = params.id;

  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [taskTitle, setTaskTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  const fetchProject = async () => {
    try {
      setError("");
      const res = await fetch(`/api/projects/${projectId}`);
      if (!res.ok) throw new Error("Проект не найден");
      const data = await res.json();
      setProject(data);
    } catch (err: any) {
      setError(err.message || "Ошибка загрузки проекта");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) fetchProject();
  }, [projectId]);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!taskTitle.trim()) {
      setError("Введите название задачи");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: taskTitle,
          projectId: Number(projectId),
          deadline: deadline || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Ошибка при добавлении задачи");
      }

      setTaskTitle("");
      setDeadline("");
      await fetchProject();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleToggleTask = async (task: Task) => {
    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isCompleted: !task.isCompleted }),
      });
      if (!res.ok) throw new Error("Не удалось обновить статус");
      await fetchProject();
    } catch (err) {
      setError("Ошибка при обновлении задачи");
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Не удалось удалить задачу");
      await fetchProject();
    } catch (err) {
      setError("Ошибка при удалении задачи");
    }
  };

  if (isLoading) return <p className="text-slate-500">Загрузка проекта...</p>;
  if (!project) return <p className="text-red-600">{error || "Проект не найден"}</p>;

  const filteredTasks = project.tasks.filter((task) => {
    if (filter === "active") return !task.isCompleted;
    if (filter === "completed") return task.isCompleted;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Шапка проекта с кнопкой Назад */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <Link href="/" className="text-sm text-blue-600 hover:underline mb-3 inline-block">
          ← Назад к проектам
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">{project.title}</h1>
        {project.description && (
          <p className="text-slate-600 mt-1">{project.description}</p>
        )}
      </div>

      {/* Блок задач и фильтров */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <h2 className="text-lg font-bold">Задачи ({project.tasks.length})</h2>

          {/* Кнопки фильтрации */}
          <div className="flex gap-1 bg-slate-100 p-1 rounded-lg text-sm">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1 rounded-md cursor-pointer ${
                filter === "all" ? "bg-white font-medium shadow-sm" : "text-slate-600"
              }`}
            >
              Все
            </button>
            <button
              onClick={() => setFilter("active")}
              className={`px-3 py-1 rounded-md cursor-pointer ${
                filter === "active" ? "bg-white font-medium shadow-sm" : "text-slate-600"
              }`}
            >
              Активные
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={`px-3 py-1 rounded-md cursor-pointer ${
                filter === "completed" ? "bg-white font-medium shadow-sm" : "text-slate-600"
              }`}
            >
              Выполненные
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">
            {error}
          </div>
        )}

        {/* Список задач */}
        {filteredTasks.length === 0 ? (
          <p className="text-slate-500 text-sm py-4">Задач в этой категории нет.</p>
        ) : (
          <ul className="space-y-2">
            {filteredTasks.map((task) => (
              <li
                key={task.id}
                className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={task.isCompleted}
                    onChange={() => handleToggleTask(task)}
                    className="w-4 h-4 accent-blue-600 cursor-pointer"
                  />
                  <div>
                    <p
                      className={
                        task.isCompleted ? "line-through text-slate-400" : "text-slate-900"
                      }
                    >
                      {task.title}
                    </p>
                    {task.deadline && (
                      <span className="text-xs text-slate-500">
                        Срок: {new Date(task.deadline).toLocaleDateString("ru-RU")}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="text-xs text-red-500 hover:text-red-700 cursor-pointer"
                >
                  Удалить
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Форма добавления новой задачи*/}
        <form onSubmit={handleAddTask} className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Новая задача..."
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            className="flex-1 border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
          />
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-600 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 cursor-pointer"
          >
            {isSubmitting ? "Добавление..." : "Добавить"}
          </button>
        </form>
      </div>
    </div>
  );
}