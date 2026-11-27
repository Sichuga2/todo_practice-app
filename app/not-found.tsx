import Link from "next/link";

export default function NotFound() {
  return (
    <div className="bg-white p-8 rounded-xl border border-slate-200 text-center space-y-4">
      <h1 className="text-3xl font-bold text-slate-900">404</h1>
      <p className="text-slate-600">Такой страницы или проекта не существует.</p>
      <Link
        href="/"
        className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        Вернуться на главную
      </Link>
    </div>
  );
}