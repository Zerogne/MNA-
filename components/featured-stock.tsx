import Link from "next/link"
import Image from "next/image"
import { Gauge, Settings2, RefreshCcw, ArrowRight } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { getCarSlug, getMainImage, type Car } from "@/lib/api"

export default async function FeaturedStock() {
  let cars: Car[] = []
  try {
    const { data } = await supabase.from('cars').select('*').order('created_at', { ascending: false }).limit(4)
    cars = data ?? []
  } catch {
    // DB not reachable — render empty section
  }


  return (
    <section id="stock" className="w-full bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Section header */}
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-black text-[#1a1a2e] text-balance">Шинэ</h2>
            <div className="mt-2 h-1 w-14 rounded-full bg-[#1e3a8a]" />
          </div>
          <Link
            href="/cars"
            className="flex items-center gap-1 text-sm font-semibold text-[#1e3a8a] hover:text-[#172554] transition-colors"
          >
            Бүгдийг харах <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cars.map((car) => (
            <article
              key={car.id}
              className="group overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-gray-100 transition-all duration-200 hover:shadow-xl hover:scale-[1.02]"
            >
              {/* Image */}
              <div className="relative aspect-video overflow-hidden bg-gray-200">
                {getMainImage(car.image) ? (
                  <Image
                    src={getMainImage(car.image)}
                    alt={`${car.year} ${car.name}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                ) : (
                  <div className="h-full w-full bg-gray-200" />
                )}
                <span
                  className={`absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide ${
                    car.badge === "SOLD" ? "bg-gray-800 text-white" : "bg-[#1e3a8a] text-white"
                  }`}
                >
                  {car.badge}
                </span>
              </div>

              {/* Card body */}
              <div className="p-4">
                <h3 className="font-bold text-[#1a1a2e]">
                  {car.year} {car.name}
                </h3>
                <p className="mt-1 text-lg font-black text-[#1e3a8a]">{car.price}</p>

                {/* Specs */}
                <div className="mt-3 grid grid-cols-3 gap-1 border-t border-gray-100 pt-3 text-xs text-gray-500">
                  <div className="flex flex-col items-center gap-1">
                    <Gauge className="h-3.5 w-3.5 text-[#1e3a8a]" />
                    <span className="text-center leading-tight">{car.mileage}</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 border-x border-gray-100">
                    <Settings2 className="h-3.5 w-3.5 text-[#1e3a8a]" />
                    <span className="text-center leading-tight">{car.engine}</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <RefreshCcw className="h-3.5 w-3.5 text-[#1e3a8a]" />
                    <span className="text-center leading-tight">{car.transmission}</span>
                  </div>
                </div>

                {/* CTA */}
                <Link
                  href={`/cars/${getCarSlug(car)}`}
                  className="mt-4 inline-flex w-full items-center justify-center rounded-xl border border-[#1e3a8a] py-2.5 text-sm font-semibold text-[#1e3a8a] transition-colors hover:bg-[#1e3a8a] hover:text-white"
                >
                  Дэлгэрэнгүй
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
