import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Gauge, Settings2, RefreshCcw, BadgeDollarSign, Palette, Fuel, Check } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { supabase } from "@/lib/supabase"
import { getCarSlug, getImageList, type Car } from "@/lib/api"

type CarDetailPageProps = {
  params: Promise<{ slug: string }>
}

function getCarBySlug(cars: Car[], slug: string) {
  return cars.find((c) => getCarSlug(c) === slug)
}

const FUEL_LABELS: Record<string, string> = {
  Petrol: "Бензин",
  Diesel: "Дизель",
  Hybrid: "Хибрид",
  Electric: "Цахилгаан",
  LPG: "LPG",
}

export default async function CarDetailPage({ params }: CarDetailPageProps) {
  const { slug } = await params
  const { data: cars } = await supabase.from('cars').select('*').order('created_at', { ascending: false })
  const car = getCarBySlug(cars ?? [], slug)

  if (!car) notFound()

  const galleryImages = getImageList(car.image)
  const thumbnails = galleryImages.slice(1, 5)
  const optionTags = car.options ? car.options.split(",").map((t) => t.trim()).filter(Boolean) : []

  return (
    <>
      <Navbar />

      <main className="w-full bg-white">
        <section className="py-10">
          <div className="mx-auto max-w-7xl space-y-8 px-4 lg:px-8">

            {galleryImages.length > 0 && (
              <>
                {/* Mobile swipeable gallery */}
                <div className="space-y-3 md:hidden">
                  <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-1">
                    {galleryImages.map((image, index) => (
                      <div
                        key={`${image}-${index}`}
                        id={`car-image-${index + 1}`}
                        className="relative h-[260px] min-w-full snap-start overflow-hidden rounded-2xl bg-gray-100 ring-1 ring-gray-200"
                      >
                        <Image
                          src={image}
                          alt={`${car.year} ${car.name} ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="100vw"
                          priority={index === 0}
                        />
                      </div>
                    ))}
                  </div>
                  {galleryImages.length > 1 && (
                    <div className="flex items-center justify-center gap-1.5">
                      {galleryImages.map((_, index) => (
                        <a
                          key={index}
                          href={`#car-image-${index + 1}`}
                          className="h-2 w-2 rounded-full bg-[#1e3a8a]/40 transition-colors hover:bg-[#1e3a8a]"
                          aria-label={`Go to image ${index + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Desktop gallery */}
                <div className="relative hidden md:block">
                  <div className="absolute -left-2 top-2 z-20 -translate-x-full pr-3 lg:-left-3">
                    <Link
                      href="/cars"
                      className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-[#1a1a2e] shadow-sm transition-colors hover:bg-[#eff6ff]"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                      Жагсаалт руу буцах
                    </Link>
                  </div>

                  {thumbnails.length === 0 ? (
                    /* Single image — full width */
                    <div className="relative h-[480px] overflow-hidden rounded-2xl bg-gray-100 ring-1 ring-gray-200">
                      <Image src={galleryImages[0]} alt={`${car.year} ${car.name}`} fill priority className="object-cover" sizes="80vw" />
                    </div>
                  ) : thumbnails.length === 1 ? (
                    /* 2 images — main left, one thumbnail right */
                    <div className="grid grid-cols-2 gap-3">
                      <div className="relative h-[420px] overflow-hidden rounded-2xl bg-gray-100 ring-1 ring-gray-200">
                        <Image src={galleryImages[0]} alt={`${car.year} ${car.name} main`} fill priority className="object-cover" sizes="45vw" />
                        <span className="absolute bottom-3 left-3 rounded-md bg-[#111827]/75 px-2 py-1 text-xs font-semibold text-white">1/{galleryImages.length}</span>
                      </div>
                      <div className="relative h-[420px] overflow-hidden rounded-2xl bg-gray-100 ring-1 ring-gray-200">
                        <Image src={thumbnails[0]} alt={`${car.year} ${car.name} 2`} fill className="object-cover" sizes="45vw" />
                      </div>
                    </div>
                  ) : thumbnails.length === 2 ? (
                    /* 3 images — main left, 2 stacked right */
                    <div className="grid grid-cols-2 gap-3">
                      <div className="relative h-[420px] overflow-hidden rounded-2xl bg-gray-100 ring-1 ring-gray-200">
                        <Image src={galleryImages[0]} alt={`${car.year} ${car.name} main`} fill priority className="object-cover" sizes="45vw" />
                        <span className="absolute bottom-3 left-3 rounded-md bg-[#111827]/75 px-2 py-1 text-xs font-semibold text-white">1/{galleryImages.length}</span>
                      </div>
                      <div className="flex flex-col gap-3">
                        {thumbnails.map((image, index) => (
                          <div key={index} className="relative flex-1 overflow-hidden rounded-2xl bg-gray-100 ring-1 ring-gray-200">
                            <Image src={image} alt={`${car.year} ${car.name} ${index + 2}`} fill className="object-cover" sizes="45vw" />
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    /* 4+ images — main left (2fr), 2×2 grid right (3fr) */
                    <div className="grid grid-cols-[2fr_3fr] gap-3">
                      <div className="relative h-[420px] overflow-hidden rounded-2xl bg-gray-100 ring-1 ring-gray-200">
                        <Image src={galleryImages[0]} alt={`${car.year} ${car.name} main`} fill priority className="object-cover" sizes="35vw" />
                        <span className="absolute bottom-3 left-3 rounded-md bg-[#111827]/75 px-2 py-1 text-xs font-semibold text-white">1/{galleryImages.length}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {thumbnails.map((image, index) => (
                          <div key={index} className="relative h-[203px] overflow-hidden rounded-2xl bg-gray-100 ring-1 ring-gray-200">
                            <Image src={image} alt={`${car.year} ${car.name} ${index + 2}`} fill className="object-cover" sizes="30vw" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
                  car.badge === "SOLD" ? "bg-gray-800 text-white" : "bg-[#1e3a8a] text-white"
                }`}
              >
                {car.badge === "SOLD" ? "Зарагдсан" : "Боломжтой"}
              </span>

              <h1 className="mt-4 text-3xl font-black text-[#1a1a2e] md:text-4xl">
                {car.year} {car.name}
              </h1>
              <p className="mt-2 text-3xl font-black text-[#1e3a8a]">{car.price}</p>

              {/* Specs grid */}
              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Гүйлт</p>
                  <p className="mt-1 flex items-center gap-2 font-semibold text-[#1a1a2e]">
                    <Gauge className="h-4 w-4 shrink-0 text-[#1e3a8a]" />
                    {car.mileage}
                  </p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Мотор</p>
                  <p className="mt-1 flex items-center gap-2 font-semibold text-[#1a1a2e]">
                    <Settings2 className="h-4 w-4 shrink-0 text-[#1e3a8a]" />
                    {car.engine}
                  </p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Хурдны хайрцаг</p>
                  <p className="mt-1 flex items-center gap-2 font-semibold text-[#1a1a2e]">
                    <RefreshCcw className="h-4 w-4 shrink-0 text-[#1e3a8a]" />
                    {car.transmission}
                  </p>
                </div>
                {car.fuel_type && (
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Түлшний төрөл</p>
                    <p className="mt-1 flex items-center gap-2 font-semibold text-[#1a1a2e]">
                      <Fuel className="h-4 w-4 shrink-0 text-[#1e3a8a]" />
                      {FUEL_LABELS[car.fuel_type] ?? car.fuel_type}
                    </p>
                  </div>
                )}
                {car.color && (
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Өнгө</p>
                    <p className="mt-1 flex items-center gap-2 font-semibold text-[#1a1a2e]">
                      <Palette className="h-4 w-4 shrink-0 text-[#1e3a8a]" />
                      {car.color}
                    </p>
                  </div>
                )}
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Төлөв</p>
                  <p className="mt-1 flex items-center gap-2 font-semibold text-[#1a1a2e]">
                    <BadgeDollarSign className="h-4 w-4 shrink-0 text-[#1e3a8a]" />
                    {car.badge === "SOLD" ? "Зарагдсан" : "Одоо боломжтой"}
                  </p>
                </div>
              </div>

              {/* Options / features */}
              {optionTags.length > 0 && (
                <div className="mt-6">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Option</p>
                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {optionTags.map((tag) => (
                      <div key={tag} className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                        <p className="mt-1 flex items-center gap-2 font-semibold text-[#1a1a2e]">
                          
                          {tag}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              {car.description && (
                <div className="mt-6">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Тайлбар</p>
                  <p className="mt-2 leading-relaxed text-[#1a1a2e]">{car.description}</p>
                </div>
              )}

              <div className="mt-6">
                <Link
                  href="/#contact"
                  className="inline-flex w-full items-center justify-center rounded-xl bg-[#1e3a8a] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#172554]"
                >
                  Холбоо барих
                </Link>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  )
}
