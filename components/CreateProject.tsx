'use client'

import { useState } from "react";

export default function CreateProject() {
    const [title, setTitle] = useState('');

    const handleCreate = () => {
        if(!title.trim()) return;
        console.log('Создаём проект:', title);
        setTitle('');
    };

    return (
    <div className="bg-white p-6 rounded-lg border border-slate-200">
      <h2 className="text-lg font-bold mb-4">Создать проект</h2>
      <div className="flex gap-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Название проекта..."
          className="border border-slate-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:border-blue-500"
        />
        <button
          type="button"
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Создать
        </button>
      </div>
    </div>
  );
}