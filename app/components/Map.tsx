'use client'

import { Map, Marker } from "pigeon-maps"
import { useEffect, useState } from "react";

interface Report {
  id: number;
  imageUrl?: string | null;
  wasteType: string;
  description: string;
  latitude: number;
  longitude: number;
  status: string;
  show: boolean;
  createdAt: string;
}

export default function MyMap() {
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    async function fetchReports() {
      try {
        const res = await fetch("/api/getreports");
        const data = await res.json();
        setReports(data);
      } catch (err) {
        console.error("Ошибка при загрузке отчётов:", err);
      }
    }

    fetchReports();
  }, []);

  const getColorByStatus = (status: string) => {
  switch (status) {
    case "PENDING":
      return "gray";
    case "IN_PROGRESS":
      return "orange";
    case "DONE":
      return "green";
    default:
      return "red";
  }
};

  return (
    <div className="w-full">
      <div className="
        w-full 
        h-[400px] 
        sm:h-[450px] 
        md:h-[500px] 
        lg:h-[600px] 
        xl:h-[500px] 
        rounded-xl 
        overflow-hidden 
        shadow-md
      ">
        <Map
          defaultCenter={[42.874466, 47.644595]}
          defaultZoom={11}
          height={undefined}
          boxClassname="w-full h-full"
        >
          {
            reports.map((loc) => (
              <Marker key={loc.id} width={40} anchor={[loc.latitude, loc.longitude]} color={getColorByStatus(loc.status)} />
            ))
          }
        </Map>
      </div>
    </div>
  )
}