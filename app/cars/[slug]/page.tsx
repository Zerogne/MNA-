import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Gauge, Settings2, RefreshCcw, BadgeDollarSign } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { carListings, getCarBySlug, getCarSlug } from "@/lib/cars"

type CarDetailPageProps = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return carListings.map((car) => ({
    slug: getCarSlug(car),
  }))
}

export default async function CarDetailPage({ params }: CarDetailPageProps) {
  const { slug } = await params
  const car = getCarBySlug(slug)
  const galleryImages = [
    car?.image,
    ...carListings.filter((item) => item.name !== car?.name || item.year !== car?.year).map((item) => item.image),
  ].filter(Boolean) as string[]

  if (!car) notFound()

  return (
    <>
      <Navbar />

      <main className="w-full bg-white">
        <section className="py-10">
          <div className="mx-auto max-w-7xl space-y-8 px-4 lg:px-8">
            <>
              <div className="space-y-3 md:hidden">
                <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-1">
                  {galleryImages.map((image, index) => (
                    <div
                      key={`${image}-${index}`}
                      id={`car-image-${index + 1}`}
                      className="min-w-full snap-start overflow-hidden rounded-2xl bg-gray-100 ring-1 ring-gray-200"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={image}
                        alt={`${car.year} ${car.name} ${index + 1}`}
                        className="h-[260px] w-full object-cover"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-center gap-1.5">
                  {galleryImages.map((image, index) => (
                    <a
                      key={`dot-${image}-${index}`}
                      href={`#car-image-${index + 1}`}
                      className="h-2 w-2 rounded-full bg-[#1e3a8a]/40 transition-colors hover:bg-[#1e3a8a]"
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              </div>

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

                <div className="grid grid-cols-[2fr_3fr] gap-3">
                  <div className="relative overflow-hidden rounded-2xl bg-gray-100 ring-1 ring-gray-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={galleryImages[0]}
                      alt={`${car.year} ${car.name} main`}
                      className="h-[420px] w-full object-cover"
                    />
                    <span className="absolute bottom-3 left-3 rounded-md bg-[#111827]/75 px-2 py-1 text-xs font-semibold text-white">
                      1/{galleryImages.length}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {galleryImages.slice(1, 5).map((image, index) => (
                      <div key={`${image}-desktop-${index}`} className="relative overflow-hidden rounded-2xl bg-gray-100 ring-1 ring-gray-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={image}
                          alt={`${car.year} ${car.name} preview ${index + 2}`}
                          className="h-[203px] w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
                  car.badge === "SOLD" ? "bg-gray-800 text-white" : "bg-[#1e3a8a] text-white"
                }`}
              >
                {car.badge}
              </span>

              <h1 className="mt-4 text-3xl font-black text-[#1a1a2e] md:text-4xl">
                {car.year} {car.name}
              </h1>
              <p className="mt-2 text-3xl font-black text-[#1e3a8a]">{car.price}</p>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Гүйлт</p>
                  <p className="mt-1 flex items-center gap-2 font-semibold text-[#1a1a2e]">
                    <Gauge className="h-4 w-4 text-[#1e3a8a]" />
                    {car.mileage}
                  </p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Хөдөлгүүр</p>
                  <p className="mt-1 flex items-center gap-2 font-semibold text-[#1a1a2e]">
                    <Settings2 className="h-4 w-4 text-[#1e3a8a]" />
                    {car.engine}
                  </p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Хурдны хайрцаг</p>
                  <p className="mt-1 flex items-center gap-2 font-semibold text-[#1a1a2e]">
                    <RefreshCcw className="h-4 w-4 text-[#1e3a8a]" />
                    {car.transmission}
                  </p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Боломжтой эсэх</p>
                  <p className="mt-1 flex items-center gap-2 font-semibold text-[#1a1a2e]">
                    <BadgeDollarSign className="h-4 w-4 text-[#1e3a8a]" />
                    {car.badge === "SOLD" ? "Зарагдсан" : "Одоо боломжтой"}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/#contact"
                  className="inline-flex w-full items-center justify-center rounded-xl bg-[#1e3a8a] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#172554]"
                >
                  Асуулга илгээх
                </Link>
                <a
                  href="tel:+97699001234"
                  className="inline-flex w-full items-center justify-center rounded-xl border border-[#1e3a8a] px-5 py-3 text-sm font-semibold text-[#1e3a8a] transition-colors hover:bg-[#eff6ff]"
                >
                  Бидэнд залгах
                </a>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  )
}
