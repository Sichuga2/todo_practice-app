"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Project {
  id: number;
  title: string;
  description: string | null;
  tasks: { id: number; isCompleted: boolean }[];
}

export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchProjects = async () => {
    try {
      setError("");
      const res = await fetch("/api/projects");
      if (!res.ok) throw new Error("Не удалось загрузить проекты");
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      setError("Ошибка при загрузке списка проектов");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Введите название проекта");
      return;
    }
    if (title.trim().length > 100) {
      setError("Название слишком длинное (максимум 100 символов)");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Ошибка создания проекта");
      }

      setTitle("");
      setDescription("");
      await fetchProjects();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProject = async (id: number) => {
    if (!confirm("Удалить проект вместе со всеми задачами?")) return;

    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Не удалось удалить проект");
      await fetchProjects();
    } catch (err) {
      setError("Ошибка при удалении проекта");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-lg font-bold mb-4">Создать проект</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleCreateProject} className="space-y-3">
          <input
            type="text"
            placeholder="Название проекта..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:border-blue-500"
          />
          <input
            type="text"
            placeholder="Краткое описание (необязательно)..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 cursor-pointer"
          >
            {isSubmitting ? "Создание..." : "Создать"}
          </button>
        </form>
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <h1 className="text-xl font-bold mb-4">Мои проекты</h1>

        {isLoading ? (
          <p className="text-slate-500">Загрузка проектов...</p>
        ) : projects.length === 0 ? (
          <p className="text-slate-500">Проектов пока нет. Создайте первый!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className="p-4 rounded-xl border border-slate-200 flex flex-col justify-between hover:border-blue-400 transition"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      href={`/projects/${project.id}`}
                      className="font-bold text-lg text-slate-900 hover:text-blue-600"
                    >
                      {project.title}
                    </Link>
                    <button
                      onClick={() => handleDeleteProject(project.id)}
                      className="text-xs text-red-500 hover:text-red-700 cursor-pointer"
                    >
                      Удалить
                    </button>
                  </div>
                  {project.description && (
                    <p className="text-sm text-slate-600 mt-1">
                      {project.description}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                    Задач: {project.tasks?.length || 0}
                  </span>
                  <Link
                    href={`/projects/${project.id}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Открыть →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}