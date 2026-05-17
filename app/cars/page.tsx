"use client"

import Link from "next/link"
import Image from "next/image"
import { Suspense, useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Gauge, Settings2, RefreshCcw, SlidersHorizontal, X } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { fetchCars, getCarSlug, getMainImage, type Car } from "@/lib/api"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

// ─── helpers ──────────────────────────────────────────────────────────────────

const getBrand = (name: string) => name.split(" ")[0]

const getFuelType = (engine: string) => {
  const e = engine.toLowerCase()
  if (e.includes("hybrid") || e.includes("phev")) return "Hybrid/EV"
  if (e.includes("turbo")) return "Turbo"
  return "Petrol"
}

const parsePriceNum = (price: string) => parseInt(price.replace(/[^0-9]/g, ""), 10)
const parseMileageNum = (mileage: string) => parseInt(mileage.replace(/[^0-9]/g, ""), 10)

function matchesPrice(price: string, range: string) {
  if (range === "all") return true
  const n = parsePriceNum(price)
  if (range === "under18k") return n < 18000
  if (range === "18k-22k") return n >= 18000 && n <= 22000
  if (range === "22k-26k") return n > 22000 && n <= 26000
  if (range === "over26k") return n > 26000
  return true
}

function matchesMileage(mileage: string, range: string) {
  if (range === "all") return true
  const n = parseMileageNum(mileage)
  if (range === "under30k") return n < 30000
  if (range === "30k-50k") return n >= 30000 && n <= 50000
  if (range === "over50k") return n > 50000
  return true
}

// ─── derived filter options (computed from live car list) ─────────────────────

function deriveOptions(cars: Car[]) {
  return {
    brands: Array.from(new Set(cars.map((c) => getBrand(c.name)))).sort(),
    transmissions: Array.from(new Set(cars.map((c) => c.transmission))).sort(),
    years: Array.from(new Set(cars.map((c) => c.year))).sort((a, b) => a - b),
    fuelTypes: Array.from(new Set(cars.map((c) => getFuelType(c.engine)))).sort(),
  }
}

const PRICE_OPTIONS = [
  { label: "Бүх үнэ", value: "all" },
  { label: "$18,000-аас доош", value: "under18k" },
  { label: "$18,000 – $22,000", value: "18k-22k" },
  { label: "$22,000 – $26,000", value: "22k-26k" },
  { label: "$26,000-аас дээш", value: "over26k" },
]

const MILEAGE_OPTIONS = [
  { label: "Бүх гүйлт", value: "all" },
  { label: "30,000 км-ээс доош", value: "under30k" },
  { label: "30,000 – 50,000 км", value: "30k-50k" },
  { label: "50,000 км-ээс дээш", value: "over50k" },
]

const SORT_OPTIONS = [
  { label: "Үндсэн", value: "default" },
  { label: "Үнэ: Бага → Их", value: "price-asc" },
  { label: "Үнэ: Их → Бага", value: "price-desc" },
  { label: "Он: Шинэ эхэлж", value: "year-desc" },
  { label: "Он: Хуучин эхэлж", value: "year-asc" },
  { label: "Гүйлт: Бага эхэлж", value: "mileage-asc" },
]

// ─── filter state type ────────────────────────────────────────────────────────

interface FilterState {
  search: string
  status: string
  brands: string[]
  transmission: string
  priceRange: string
  yearMin: string
  yearMax: string
  mileage: string
  fuelTypes: string[]
}

const DEFAULT_FILTERS: FilterState = {
  search: "",
  status: "all",
  brands: [],
  transmission: "all",
  priceRange: "all",
  yearMin: "all",
  yearMax: "all",
  mileage: "all",
  fuelTypes: [],
}

// ─── sub-components ───────────────────────────────────────────────────────────

function FilterLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
      {children}
    </p>

  )
}

function ChipToggle({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
        active
          ? "border-[#1e3a8a] bg-[#1e3a8a] text-white"
          : "border-gray-200 bg-white text-gray-600 hover:border-[#1e3a8a] hover:text-[#1e3a8a]"
      }`}
    >
      {children}
    </button>
  )
}

function StyledSelect({
  value,
  onChange,
  children,
}: {
  value: string
  onChange: (v: string) => void
  children: React.ReactNode
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-[#1a1a2e] outline-none transition focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a]/20"
    >
      {children}
    </select>
  )
}

// ─── filter panel (shared between sidebar + mobile sheet) ─────────────────────

function FilterPanel({
  filters,
  setFilters,
  options,
}: {
  filters: FilterState
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>
  options: ReturnType<typeof deriveOptions>
}) {
  const set = <K extends keyof FilterState>(key: K, value: FilterState[K]) =>
    setFilters((prev) => ({ ...prev, [key]: value }))

  const toggleArr = (key: "brands" | "fuelTypes", value: string) =>
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value],
    }))

  return (
    <div className="space-y-5">
      {/* Search */}
      <div>
        <FilterLabel>Хайх</FilterLabel>
        <input
          type="text"
          value={filters.search}
          onChange={(e) => set("search", e.target.value)}
          placeholder="Нэр, он, загвар…"
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-[#1a1a2e] outline-none transition focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a]/20"
        />
      </div>

      {/* Status */}
      <div>
        <FilterLabel>Төлөв</FilterLabel>
        <div className="flex gap-2">
          {[
            { value: "all", label: "Бүгд" },
            { value: "available", label: "Боломжтой" },
            { value: "sold", label: "Зарагдсан" },
          ].map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => set("status", s.value)}
              className={`flex-1 rounded-lg border py-2 text-xs font-semibold transition-colors ${
                filters.status === s.value
                  ? "border-[#1e3a8a] bg-[#1e3a8a] text-white"
                  : "border-gray-200 bg-white text-gray-600 hover:border-[#1e3a8a] hover:text-[#1e3a8a]"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Brand */}
      <div>
        <FilterLabel>Марк</FilterLabel>
        <div className="flex flex-wrap gap-1.5">
          {options.brands.map((brand) => (
            <ChipToggle
              key={brand}
              active={filters.brands.includes(brand)}
              onClick={() => toggleArr("brands", brand)}
            >
              {brand}
            </ChipToggle>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <FilterLabel>Үнийн хязгаар</FilterLabel>
        <StyledSelect value={filters.priceRange} onChange={(v) => set("priceRange", v)}>
          {PRICE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </StyledSelect>
      </div>

      {/* Year Range */}
      <div>
        <FilterLabel>Он</FilterLabel>
        <div className="flex items-center gap-2">
          <select
            value={filters.yearMin}
            onChange={(e) => set("yearMin", e.target.value)}
            className="flex-1 rounded-lg border border-gray-200 bg-white px-2 py-2.5 text-sm text-[#1a1a2e] outline-none transition focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a]/20"
          >
            <option value="all">Оноос</option>
            {options.years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-400">–</span>
          <select
            value={filters.yearMax}
            onChange={(e) => set("yearMax", e.target.value)}
            className="flex-1 rounded-lg border border-gray-200 bg-white px-2 py-2.5 text-sm text-[#1a1a2e] outline-none transition focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a]/20"
          >
            <option value="all">Хүртэл</option>
            {options.years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Transmission */}
      <div>
        <FilterLabel>Хурдны хайрцаг</FilterLabel>
        <div className="flex flex-wrap gap-1.5">
          <ChipToggle active={filters.transmission === "all"} onClick={() => set("transmission", "all")}>
            Бүгд
          </ChipToggle>
          {options.transmissions.map((t) => (
            <ChipToggle
              key={t}
              active={filters.transmission === t}
              onClick={() => set("transmission", t)}
            >
              {t}
            </ChipToggle>
          ))}
        </div>
      </div>

      {/* Mileage */}
      <div>
        <FilterLabel>Гүйлт</FilterLabel>
        <StyledSelect value={filters.mileage} onChange={(v) => set("mileage", v)}>
          {MILEAGE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </StyledSelect>
      </div>

      {/* Fuel Type */}
      <div>
        <FilterLabel>Шатахууны төрөл</FilterLabel>
        <div className="flex flex-wrap gap-1.5">
          {options.fuelTypes.map((f) => (
            <ChipToggle
              key={f}
              active={filters.fuelTypes.includes(f)}
              onClick={() => toggleArr("fuelTypes", f)}
            >
              {f}
            </ChipToggle>
          ))}
        </div>
      </div>

      {/* Clear */}
      <button
        type="button"
        onClick={() => setFilters(DEFAULT_FILTERS)}
        className="w-full rounded-lg border border-red-200 bg-red-50 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100"
      >
        Бүх шүүлтүүр цэвэрлэх
      </button>
    </div>
  )
}

// ─── main page ────────────────────────────────────────────────────────────────

function CarsPageContent() {
  const searchParams = useSearchParams()
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<FilterState>(() => ({
    ...DEFAULT_FILTERS,
    search: searchParams.get("search") ?? "",
    brands: searchParams.get("brand") ? [searchParams.get("brand")!] : [],
    priceRange: searchParams.get("priceRange") ?? "all",
    yearMin: searchParams.get("yearMin") ?? "all",
    yearMax: searchParams.get("yearMax") ?? "all",
  }))
  const [sortBy, setSortBy] = useState("default")

  useEffect(() => {
    fetchCars().then(setCars).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const options = useMemo(() => deriveOptions(cars), [cars])

  const activeCount = useMemo(() => {
    let n = 0
    if (filters.search.trim()) n++
    if (filters.status !== "all") n++
    if (filters.brands.length) n++
    if (filters.transmission !== "all") n++
    if (filters.priceRange !== "all") n++
    if (filters.yearMin !== "all" || filters.yearMax !== "all") n++
    if (filters.mileage !== "all") n++
    if (filters.fuelTypes.length) n++
    return n
  }, [filters])

  const activeChips = useMemo(() => {
    const chips: { key: string; label: string; onRemove: () => void }[] = []

    if (filters.search.trim())
      chips.push({
        key: "search",
        label: `"${filters.search}"`,
        onRemove: () => setFilters((p) => ({ ...p, search: "" })),
      })

    if (filters.status !== "all")
      chips.push({
        key: "status",
        label: filters.status.charAt(0).toUpperCase() + filters.status.slice(1),
        onRemove: () => setFilters((p) => ({ ...p, status: "all" })),
      })

    filters.brands.forEach((b) =>
      chips.push({
        key: `brand-${b}`,
        label: b,
        onRemove: () =>
          setFilters((p) => ({ ...p, brands: p.brands.filter((v) => v !== b) })),
      }),
    )

    if (filters.transmission !== "all")
      chips.push({
        key: "transmission",
        label: filters.transmission,
        onRemove: () => setFilters((p) => ({ ...p, transmission: "all" })),
      })

    if (filters.priceRange !== "all") {
      const label = PRICE_OPTIONS.find((o) => o.value === filters.priceRange)?.label ?? ""
      chips.push({
        key: "price",
        label,
        onRemove: () => setFilters((p) => ({ ...p, priceRange: "all" })),
      })
    }

    if (filters.yearMin !== "all" || filters.yearMax !== "all")
      chips.push({
        key: "year",
        label: `${filters.yearMin !== "all" ? filters.yearMin : "Any"} – ${filters.yearMax !== "all" ? filters.yearMax : "Any"}`,
        onRemove: () => setFilters((p) => ({ ...p, yearMin: "all", yearMax: "all" })),
      })

    if (filters.mileage !== "all") {
      const label = MILEAGE_OPTIONS.find((o) => o.value === filters.mileage)?.label ?? ""
      chips.push({
        key: "mileage",
        label,
        onRemove: () => setFilters((p) => ({ ...p, mileage: "all" })),
      })
    }

    filters.fuelTypes.forEach((f) =>
      chips.push({
        key: `fuel-${f}`,
        label: f,
        onRemove: () =>
          setFilters((p) => ({ ...p, fuelTypes: p.fuelTypes.filter((v) => v !== f) })),
      }),
    )

    return chips
  }, [filters])

  const results = useMemo(() => {
    const list = cars.filter((car) => {
      const q = filters.search.trim().toLowerCase()
      if (q && !`${car.year} ${car.name}`.toLowerCase().includes(q)) return false
      if (filters.status === "available" && car.badge === "SOLD") return false
      if (filters.status === "sold" && car.badge !== "SOLD") return false
      if (filters.brands.length && !filters.brands.includes(getBrand(car.name))) return false
      if (filters.transmission !== "all" && car.transmission !== filters.transmission) return false
      if (!matchesPrice(car.price, filters.priceRange)) return false
      if (filters.yearMin !== "all" && car.year < parseInt(filters.yearMin)) return false
      if (filters.yearMax !== "all" && car.year > parseInt(filters.yearMax)) return false
      if (!matchesMileage(car.mileage, filters.mileage)) return false
      if (filters.fuelTypes.length && !filters.fuelTypes.includes(getFuelType(car.engine)))
        return false
      return true
    })

    if (sortBy === "price-asc")
      list.sort((a, b) => parsePriceNum(a.price) - parsePriceNum(b.price))
    else if (sortBy === "price-desc")
      list.sort((a, b) => parsePriceNum(b.price) - parsePriceNum(a.price))
    else if (sortBy === "year-desc") list.sort((a, b) => b.year - a.year)
    else if (sortBy === "year-asc") list.sort((a, b) => a.year - b.year)
    else if (sortBy === "mileage-asc")
      list.sort((a, b) => parseMileageNum(a.mileage) - parseMileageNum(b.mileage))

    return list
  }, [cars, filters, sortBy])

  return (
    <>
      <Navbar />

      <main className="w-full bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">

          {/* ── top bar ─────────────────────────────────────────────── */}
          <div className="mb-5 flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-gray-600">
              <span className="font-bold text-[#1a1a2e]">{results.length}</span> машин олдлоо
            </p>

            <div className="flex items-center gap-2">
              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 outline-none focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a]/20"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>

              {/* Mobile filter button */}
              <Sheet>
                <SheetTrigger asChild>
                  <button
                    type="button"
                    className="relative flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition hover:border-[#1e3a8a] hover:text-[#1e3a8a] lg:hidden"
                  >
                    <SlidersHorizontal className="h-3.5 w-3.5" />
                    Шүүлтүүр
                    {activeCount > 0 && (
                      <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#1e3a8a] text-[10px] font-bold text-white">
                        {activeCount}
                      </span>
                    )}
                  </button>
                </SheetTrigger>
                <SheetContent
                  side="bottom"
                  className="max-h-[88vh] overflow-y-auto rounded-t-2xl px-5 pb-10 pt-2"
                >
                  <SheetHeader className="mb-4 px-0">
                    <SheetTitle className="text-left text-base font-bold text-[#1a1a2e]">
                      Шүүлтүүр
                    </SheetTitle>
                  </SheetHeader>
                  <FilterPanel filters={filters} setFilters={setFilters} options={options} />
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* ── active chips ─────────────────────────────────────────── */}
          {activeChips.length > 0 && (
            <div className="mb-5 flex flex-wrap gap-2">
              {activeChips.map((chip) => (
                <button
                  key={chip.key}
                  type="button"
                  onClick={chip.onRemove}
                  className="flex items-center gap-1.5 rounded-full border border-[#1e3a8a]/30 bg-[#eff6ff] px-3 py-1 text-xs font-medium text-[#1e3a8a] transition hover:bg-[#dbeafe]"
                >
                  {chip.label}
                  <X className="h-3 w-3 shrink-0" />
                </button>
              ))}
              <button
                type="button"
                onClick={() => setFilters(DEFAULT_FILTERS)}
                className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-600 transition hover:bg-red-100"
              >
                Бүгдийг цэвэрлэх
              </button>
            </div>
          )}

          {/* ── two-column layout ────────────────────────────────────── */}
          <div className="lg:flex lg:gap-8">

            {/* Desktop sidebar */}
            <aside className="hidden w-64 shrink-0 lg:block">
              <div className="sticky top-24 rounded-2xl border border-gray-200 bg-gray-50 p-5">
                <div className="mb-5 flex items-center justify-between">
                  <p className="text-sm font-bold text-[#1a1a2e]">Шүүлтүүр</p>
                  {activeCount > 0 && (
                    <span className="rounded-full bg-[#1e3a8a] px-2 py-0.5 text-[10px] font-bold text-white">
                      {activeCount} идэвхтэй
                    </span>
                  )}
                </div>
                <FilterPanel filters={filters} setFilters={setFilters} options={options} />
              </div>
            </aside>

            {/* Cars grid */}
            <div className="flex-1 min-w-0">
              {loading ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-72 animate-pulse rounded-2xl bg-gray-100" />
                  ))}
                </div>
              ) : results.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-16 text-center">
                  <p className="font-semibold text-[#1a1a2e]">Шүүлтүүрт тохирох машин байхгүй</p>
                  <p className="mt-1 text-sm text-gray-500">
                    Шүүлтүүрийг өөрчлөх эсвэл цэвэрлэж үзнэ үү.
                  </p>
                  <button
                    type="button"
                    onClick={() => setFilters(DEFAULT_FILTERS)}
                    className="mt-4 rounded-lg border border-[#1e3a8a] px-4 py-2 text-sm font-semibold text-[#1e3a8a] transition hover:bg-[#1e3a8a] hover:text-white"
                  >
                    Шүүлтүүр цэвэрлэх
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {results.map((car) => (
                    <article
                      key={car.name + car.year}
                      className="group overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-gray-100 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl"
                    >
                      <div className="relative aspect-video overflow-hidden bg-gray-200">
                        {getMainImage(car.image) ? (
                          <Image
                            src={getMainImage(car.image)}
                            alt={`${car.year} ${car.name}`}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="h-full w-full bg-gray-200" />
                        )}
                        <span
                          className={`absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide ${
                            car.badge === "SOLD"
                              ? "bg-gray-800 text-white"
                              : "bg-[#1e3a8a] text-white"
                          }`}
                        >
                          {car.badge}
                        </span>
                      </div>

                      <div className="p-4">
                        <h2 className="font-bold text-[#1a1a2e]">
                          {car.year} {car.name}
                        </h2>
                        <p className="mt-1 text-lg font-black text-[#1e3a8a]">{car.price}</p>

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
              )}
            </div>
          </div>
        </div>

        <Footer />
      </main>
    </>
  )
}

export default function CarsPage() {
  return (
    <Suspense>
      <CarsPageContent />
    </Suspense>
  )
}
