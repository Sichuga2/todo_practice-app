export default function HomePage(){
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg border border-slate-200">
        <h2 className="text-lg font-bold mb-4">Создать проект</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Название проекта..."
            className="border border-slate-300 rounded-lg px-3 py-2 w-full 
            focus:outline-none focus:border-blue-500"
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
            Создать
          </button>
        </div>
      </div>
      <h2 className="text-lg font-bold py-1">Мои проекты</h2>
      <div className="space-5">
        <div className="p-5 border border-slate-400 rounded-lg justify-between">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white pb-5 rounded-lg">
              <p className="text-lg font-medium mt-5 px-5 text-blue-600">Учёба и практика</p>
              <p className="text-sm font-medium mt-5 px-5 text-slate-400">Описание проекта</p>
            </div>
            <div className="bg-white pb-5 rounded-lg">
              <p className="text-lg font-medium mt-5 px-5 text-blue-600">Разработка игры</p>
              <p className="text-sm font-medium mt-5 px-5 text-slate-400">Описание проекта</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};