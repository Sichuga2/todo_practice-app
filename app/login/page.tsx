"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const response = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (response.ok) {
      router.push("/");
      router.refresh();
    } else {
      const data = await response.json();
      setError(data.error || "Ошибка входа");
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-12 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <h1 className="text-xl font-bold text-center mb-2">Вход в Tasker</h1>
      <p className="text-sm text-slate-500 text-center mb-6">
        Введите пароль доступа
      </p>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <input
            type="password"
            placeholder="Пароль..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 p-2 rounded-lg text-center">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition cursor-pointer"
        >
          Войти
        </button>
      </form>
    </div>
  );
}