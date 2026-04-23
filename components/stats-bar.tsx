const stats = [
  { value: "10,000+", label: "Машин байна" },
  { value: "22", label: "Жилийн туршлага" },
  { value: "5,000+", label: "Сэтгэл хангалуун үйлчлүүлэгч" },
  { value: "Шууд", label: "Японоос тээвэр" },
]

export default function StatsBar() {
  return (
    <section className="w-full bg-[#f5f5f5] py-12">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`flex flex-col items-center text-center ${
                i < stats.length - 1
                  ? "md:border-r md:border-gray-300"
                  : ""
              }`}
            >
              <span className="text-4xl font-black text-[#1e3a8a] md:text-5xl">{stat.value}</span>
              <span className="mt-2 text-sm font-medium text-gray-600">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
