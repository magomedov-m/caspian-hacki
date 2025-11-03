'use client'

import { signInGoogle } from "@/lib/actions/auth-actions"
import { Button } from "@mui/material";
import { FcGoogle } from "react-icons/fc"

export default function AuthPage() {
  async function handleSignIn() {
    await signInGoogle('google');
  }
  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 flex flex-col items-center text-center">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <FcGoogle className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Добро пожаловать в Caspian Clean Map
          </h1>
          <p className="text-gray-500 mt-2 text-sm sm:text-base">
            Войдите через Google, чтобы сообщать о загрязнениях, участвовать в уборках и отслеживать прогресс.
          </p>
        </div>

        <Button
          onClick={handleSignIn}
          variant="outlined"
        >
          <FcGoogle className="w-6 h-6" />
          <span className="font-medium text-gray-700">Войти через Google</span>
        </Button>

        <div className="mt-8 text-gray-400 text-sm">
          <p>Ваш аккаунт используется только для авторизации,</p>
          <p>мы не храним личные данные без вашего согласия.</p>
        </div>
      </div>
    </main>
  )
}