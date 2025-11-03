'use client'
import { signOut } from "@/lib/actions/auth-actions";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";

export default function Page() {
    const router = useRouter();

    async function handleSignOut() {
        await signOut();
        router.push('/auth')
    }
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      <section className="w-full max-w-3xl bg-white shadow-md rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start sm:justify-between gap-6 border-b pb-6">
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-3xl font-bold">
              VA
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">
                Волонтёр Магомед
              </h1>
              <p className="text-gray-500 text-sm">@magomed</p>
            </div>
          </div>

          
          <Button variant="contained">Редактировать</Button>
          <Button variant="outlined" onClick={handleSignOut}>Выйти</Button>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <h3 className="text-gray-500 text-sm">Роль</h3>
            <p className="font-medium text-gray-800">Волонтёр</p>
          </div>
          <div>
            <h3 className="text-gray-500 text-sm">Регион</h3>
            <p className="font-medium text-gray-800">Дагестан, Махачкала</p>
          </div>
          <div>
            <h3 className="text-gray-500 text-sm">E-mail</h3>
            <p className="font-medium text-gray-800">magomedovworkdev@gmail.com</p>
          </div>
          <div>
            <h3 className="text-gray-500 text-sm">Дата регистрации</h3>
            <p className="font-medium text-gray-800">31 октября 2025</p>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Активность
          </h2>

          <div className="space-y-3">
            <div className="p-4 border rounded-xl hover:bg-gray-50 transition">
              <p className="text-gray-700 text-sm">
                🌿 Добавил новую точку загрязнения в районе Каспийска
              </p>
              <p className="text-gray-400 text-xs mt-1">3 дня назад</p>
            </div>

            <div className="p-4 border rounded-xl hover:bg-gray-50 transition">
              <p className="text-gray-700 text-sm">
                🧹 Участвовал в уборке локации «Сулакская набережная»
              </p>
              <p className="text-gray-400 text-xs mt-1">1 неделю назад</p>
            </div>

            <div className="p-4 border rounded-xl hover:bg-gray-50 transition">
              <p className="text-gray-700 text-sm">
                📸 Загрузил фото очищенного участка
              </p>
              <p className="text-gray-400 text-xs mt-1">2 недели назад</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}