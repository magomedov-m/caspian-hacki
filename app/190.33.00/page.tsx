'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { Select, MenuItem } from "@mui/material";

interface Report {
  id: number;
  wasteType: string;
  description: string;
  status: "PENDING" | "IN_PROGRESS" | "DONE";
  latitude: number;
  longitude: number;
  imageUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  show: boolean;
}

interface User {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  createdAt: string;
  emailVerified: boolean;
}

export default function AdminPage() {
  const [isTyping, setIsTyping] = useState(false);

  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
const [input, setInput] = useState("");

const sendMessage = async () => {
  if (!input.trim()) return;

  const userMsg = { role: "user" as const, content: input };
  setMessages((prev) => [...prev, userMsg]);
  setInput("");
  setIsTyping(true);

  try {
    const res = await fetch("/api/stats-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });

    const data = await res.json();

    const aiMsg = {
      role: "assistant" as const,
      content: data.answer || "Нет ответа",
    };

    setMessages((prev) => [...prev, aiMsg]);
  } catch (err) {
    console.error("Ошибка:", err);
    setMessages((prev) => [
      ...prev,
      { role: "assistant" as const, content: "Ошибка при получении ответа от ИИ" },
    ]);
  } finally {
    setIsTyping(false);
  }
};



  const [reports, setReports] = useState<Report[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [filter, setFilter] = useState<"all" | "IN_PROGRESS" | "DONE">("all");
  const [activeSection, setActiveSection] = useState<"home" | "reports" | "users" | "stats">("home");

  const fetchReports = async () => {
    try {
      const res = await fetch("/api/getreports");
      const data: Report[] = await res.json();
      setReports(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/getusers");
      const data: User[] = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (activeSection === "reports") fetchReports();
    if (activeSection === "users") fetchUsers();
  }, [activeSection]);

  const handleStatusChange = async (id: number, newStatus: "IN_PROGRESS" | "DONE") => {
    try {
      const res = await fetch("/api/update-report-status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (!res.ok) throw new Error("Ошибка обновления");
      setReports(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    } catch (err) {
      console.error(err);
      alert("Не удалось обновить статус");
    }
  };

  const filteredReports = filter === "all"
    ? reports
    : reports.filter(r => r.status === filter);

  const renderContent = () => {
    if (activeSection === "home") {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center text-gray-700">
          <h1 className="text-3xl font-semibold mb-4 text-blue-600">Добро пожаловать в Админ Панель 🌍</h1>
          <p>Выберите раздел слева, чтобы начать работу.</p>
        </div>
      );
    }

    if (activeSection === "reports") {
      return (
        <>
          <h1 className="text-2xl font-semibold">Список отчётов о загрязнениях</h1>

          <div className="flex gap-3 mb-4">
            <button
              className={`px-4 py-2 rounded-lg text-sm border transition ${
                filter === "all" ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
              onClick={() => setFilter("all")}
            >
              Все
            </button>
            <button
              className={`px-4 py-2 rounded-lg text-sm border transition ${
                filter === "IN_PROGRESS" ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
              onClick={() => setFilter("IN_PROGRESS")}
            >
              В процессе
            </button>
            <button
              className={`px-4 py-2 rounded-lg text-sm border transition ${
                filter === "DONE" ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
              onClick={() => setFilter("DONE")}
            >
              Выполнено
            </button>
          </div>

          {/* Карточки отчётов */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map(report => (
              <div
                key={report.id}
                className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md flex flex-col justify-between"
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="font-semibold text-blue-700">{report.wasteType}</span>
                  {report.status !== "PENDING" ? (
                    <Select
                      value={report.status}
                      size="small"
                      onChange={(e) =>
                        handleStatusChange(report.id, e.target.value as "IN_PROGRESS" | "DONE")
                      }
                      className="text-xs"
                    >
                      <MenuItem value="IN_PROGRESS">В процессе</MenuItem>
                      <MenuItem value="DONE">Выполнено</MenuItem>
                    </Select>
                  ) : (
                    <span className="px-2 py-1 text-xs rounded-full font-semibold bg-red-100 text-red-700">
                      Новая
                    </span>
                  )}
                </div>

                <div className="text-sm text-gray-600 mb-2 space-y-1">
                  <p><span className="font-medium">Описание:</span> {report.description}</p>
                  <p><span className="font-medium">Координаты:</span> {report.latitude}, {report.longitude}</p>
                  <p><span className="font-medium">Создано:</span> {new Date(report.createdAt).toLocaleString()}</p>
                  <p><span className="font-medium">Обновлено:</span> {new Date(report.updatedAt).toLocaleString()}</p>
                  <p><span className="font-medium">Показывать на карте:</span> {report.show ? "Да" : "Нет"}</p>
                  {report.imageUrl && (
                    <img src={report.imageUrl} alt="Фото отчёта" className="mt-2 rounded shadow-md max-h-48" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      );
    }

    if (activeSection === "users") {
      return (
        <>
          <h1 className="text-2xl font-semibold mb-4">Список волонтеров</h1>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map(user => (
              <div
                key={user.id}
                className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md w-90"
              >
                <div className="flex items-center gap-3 mb-3">
                  {user.image ? (
                    <img src={`${user.image}`} alt={user.name} className="w-10 h-10 rounded-full" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">👤</div>
                  )}
                  <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mb-1">
                  <span className="font-medium">Email подтверждён:</span> {user.emailVerified ? "✅ Да" : "❌ Нет"}
                </p>
                <p className="text-xs text-gray-600">
                  <span className="font-medium">Дата регистрации:</span> {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </>
      );
    }

    if (activeSection === "stats") {
  return (
    <div className="flex flex-col items-center max-w-2xl mx-auto w-full animate-fade-in">
      
      <p className="text-gray-500 mb-6 mt-10 text-center">
        
        Задайте вопрос, например: <br />
        <span className="italic text-gray-600">«Сколько всего волонтёров?»</span> или{" "}
        <span className="italic text-gray-600">«Выдай статистику по типам мусора»</span>.
      </p>

      <div className="w-full bg-white border rounded-2xl shadow-lg p-5 flex flex-col gap-4">
        <div className="flex flex-col gap-3 h-96 overflow-y-auto p-3 border rounded-xl bg-gray-50 scroll-smooth">
          {messages.length === 0 && (
            <div className="text-gray-400 text-center mt-20">
              💬 Начните диалог с ИИ...
            </div>
          )}

          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`max-w-[80%] p-3 rounded-2xl transition-all duration-300 shadow-sm ${
                msg.role === "user"
                  ? "bg-blue-500 text-white self-end rounded-br-none"
                  : "bg-gray-100 text-gray-800 self-start rounded-bl-none"
              }`}
            >
              {msg.content}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-gray-500 text-sm self-start pl-1 animate-fade-in">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]"></div>
              <span className="ml-2">ИИ печатает...</span>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Введите запрос..."
            className="flex-1 border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          <button
            onClick={sendMessage}
            disabled={isTyping}
            className={`px-5 py-2 rounded-xl font-medium text-white transition ${
              isTyping
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isTyping ? "..." : "Отправить"}
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}


  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-white border-r shadow-sm p-6 flex flex-col gap-6">
        <div className="text-2xl font-bold text-blue-600">Админ Панель</div>
        <nav className="flex flex-col gap-3 text-gray-700">
          <button onClick={() => setActiveSection("home")} className="text-left hover:text-blue-600">🏠 Главная</button>
          <button onClick={() => setActiveSection("reports")} className="text-left hover:text-blue-600">📍 Все метки</button>
          <button onClick={() => setActiveSection("users")} className="text-left hover:text-blue-600">👥 Волонтеры</button>
          <button onClick={() => setActiveSection("stats")} className="text-left hover:text-blue-600">📊 ИИ Статистика</button>
        </nav>
        <Link href='/'><button className="mt-auto bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 transition">
          Выйти
        </button></Link>
      </aside>

      <section className="flex-1 p-6 sm:p-8 flex flex-col gap-6">
        {renderContent()}
      </section>
    </main>
  );
}
