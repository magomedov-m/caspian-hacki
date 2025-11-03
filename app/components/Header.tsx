"use client";

import { auth } from "@/lib/auth";
import { Button } from "@mui/material";
import Link from "next/link";
// import { usePathname } from "next/navigation";

type Session = typeof auth.$Infer.Session

export default function Header({session}: {session: Session | null}) {
//   const pathname = usePathname();

  return (
    <header className="w-full fixed top-0 left-0 z-50 bg-white/70 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="flex text-xl font-semibold text-blue-700">
          🌊 <h2 color="blue" className="ml-3">WALLEE</h2>
        </Link>

        <div className="flex items-center gap-3">
          <Link href="/add">
          </Link>
          {session ? <Link href="/profile">
            <Button variant="outlined">
              Профиль
            </Button>
          </Link> : <Link href="/auth">
            <Button variant="outlined">
              Войти
            </Button>
          </Link>}
        </div>
      </div>
    </header>
  );
}
