'use client'
type Props = object

export default function CartList (props: Props) {
  return (
    <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-center sm:text-left">
            Последние отчёты
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="border rounded-xl shadow-sm p-4 flex flex-col gap-2 hover:shadow-md transition bg-white"
              >
                <div className="h-32 sm:h-40 bg-gray-200 rounded" />
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
                  <span className="font-semibold text-blue-700 text-sm sm:text-base">
                    Тип: Мусор
                  </span>
                  <span className="text-xs sm:text-sm text-gray-500">
                    Статус: новая
                  </span>
                </div>
                <p className="text-gray-600 text-xs sm:text-sm">
                  Краткое описание загрязнения. Можно будет открыть подробнее.
                </p>
              </div>
            ))}
          </div>
        </section>
  )
}