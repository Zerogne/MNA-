"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { useRouter } from "next/navigation"

const makes = ["Toyota", "Honda", "Nissan", "Mazda", "Mitsubishi", "Subaru", "Suzuki"]
const models = ["Land Cruiser", "Prado", "Hilux", "Alphard", "Harrier", "RAV4", "Vitz"]
const years = Array.from({ length: 20 }, (_, i) => (2024 - i).toString())
const priceOptions = [
  { label: "Бүх үнэ", value: "" },
  { label: "$18,000-аас доош", value: "under18k" },
  { label: "$18,000 – $22,000", value: "18k-22k" },
  { label: "$22,000 – $26,000", value: "22k-26k" },
  { label: "$26,000-аас дээш", value: "over26k" },
]

export default function SearchBar() {
  const router = useRouter()
  const [make, setMake] = useState("")
  const [model, setModel] = useState("")
  const [yearFrom, setYearFrom] = useState("")
  const [yearTo, setYearTo] = useState("")
  const [priceRange, setPriceRange] = useState("")

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (make) params.set("brand", make)
    if (model) params.set("search", model)
    if (yearFrom) params.set("yearMin", yearFrom)
    if (yearTo) params.set("yearMax", yearTo)
    if (priceRange) params.set("priceRange", priceRange)
    router.push(`/cars${params.size ? `?${params}` : ""}`)
  }

  return (
    <div className="relative z-10 mx-auto -mt-10 max-w-6xl px-4 lg:px-8">
      <div className="rounded-2xl bg-white p-4 shadow-lg ring-1 ring-gray-100 md:p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:gap-3">
          {/* Make */}
          <div className="flex-1">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">Марк</label>
            <select
              value={make}
              onChange={(e) => setMake(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-[#1a1a2e] focus:border-[#1e3a8a] focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20"
            >
              <option value="">Бүх марк</option>
              {makes.map((m) => <option key={m}>{m}</option>)}
            </select>
          </div>
          {/* Model */}
          <div className="flex-1">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">Загвар</label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-[#1a1a2e] focus:border-[#1e3a8a] focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20"
            >
              <option value="">Бүх загвар</option>
              {models.map((m) => <option key={m}>{m}</option>)}
            </select>
          </div>
          {/* Year From */}
          <div className="flex-1">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">Он</label>
            <select
              value={yearFrom}
              onChange={(e) => setYearFrom(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-[#1a1a2e] focus:border-[#1e3a8a] focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20"
            >
              <option value="">Бүх он</option>
              {years.map((y) => <option key={y}>{y}</option>)}
            </select>
          </div>
          {/* Year To */}
          
          {/* Price Range */}
          <div className="flex-1">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">Үнийн хязгаар</label>
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-[#1a1a2e] focus:border-[#1e3a8a] focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20"
            >
              {priceOptions.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
          </div>
          {/* Search Button */}
          <div>
            <button
              onClick={handleSearch}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1e3a8a] px-6 py-2.5 text-sm font-bold text-white shadow transition-colors hover:bg-[#172554] md:w-auto"
            >
              <Search className="h-4 w-4" />
              Хайх
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
