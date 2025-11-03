'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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
}

export default function ReportPage() {
  const params = useParams();
  const reportId = params.id;
  const [report, setReport] = useState<Report | null>(null);

  useEffect(() => {
    if (!reportId) return;

    async function fetchReport() {
      try {
        const res = await fetch(`/api/getreport?id=${reportId}`);
        if (!res.ok) throw new Error("Ошибка загрузки отчёта");
        const data: Report = await res.json();
        setReport(data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchReport();
  }, [reportId]);

  const handleStatusChange = async (newStatus: "IN_PROGRESS" | "DONE") => {
    if (!report) return;

    try {
      const res = await fetch("/api/update-report-status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: report.id, status: newStatus }),
      });
      if (!res.ok) throw new Error("Ошибка обновления статуса");

      setReport({ ...report, status: newStatus });
    } catch (err) {
      console.error(err);
      alert("Не удалось обновить статус");
    }
  };

  if (!report) return <div className="p-6 text-gray-700">Загрузка отчёта...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Детали отчёта</h1>

      <p><span className="font-medium">Тип мусора:</span> {report.wasteType}</p>
      <p><span className="font-medium">Описание:</span> {report.description}</p>
      <p>
        <span className="font-medium">Статус:</span>{" "}
        {report.status === "PENDING"
          ? "Новая"
          : report.status === "IN_PROGRESS"
          ? "В работе"
          : "Выполнено"}
      </p>

      {report.status !== "PENDING" && (
        <Select
          value={report.status}
          size="small"
          onChange={(e) => handleStatusChange(e.target.value as "IN_PROGRESS" | "DONE")}
          className="mt-2"
        >
          <MenuItem value="IN_PROGRESS">В процессе</MenuItem>
          <MenuItem value="DONE">Выполнено</MenuItem>
        </Select>
      )}

      <p><span className="font-medium">Координаты:</span> {report.latitude}, {report.longitude}</p>
      <p><span className="font-medium">Дата:</span> {new Date(report.createdAt).toLocaleDateString()}</p>

      {report.imageUrl && (
        <img
          src={report.imageUrl}
          alt="Фото загрязнения"
          className="mt-4 rounded shadow-md max-h-96"
        />
      )}
    </div>
  );
}
