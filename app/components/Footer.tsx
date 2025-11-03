export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 mt-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6 text-center text-gray-600 text-sm">
        © {new Date().getFullYear()} Каспий без мусора — экопроект.  
        Сделано с 💚 ради чистого побережья.
      </div>
    </footer>
  );
}