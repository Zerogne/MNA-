"use client"

import { Search } from "lucide-react"

const makes = ["Toyota", "Honda", "Nissan", "Mazda", "Mitsubishi", "Subaru", "Suzuki"]
const models = ["Land Cruiser", "Prado", "Hilux", "Alphard", "Harrier", "RAV4", "Vitz"]
const years = Array.from({ length: 20 }, (_, i) => (2024 - i).toString())
const priceRanges = ["$5,000-аас доош", "$5,000–$10,000", "$10,000–$20,000", "$20,000+"]

export default function SearchBar() {
  return (
    <div className="relative z-10 mx-auto -mt-10 max-w-6xl px-4 lg:px-8">
      <div className="rounded-2xl bg-white p-4 shadow-lg ring-1 ring-gray-100 md:p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-3">
          {/* Make */}
          <div className="flex-1">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">Марк</label>
            <select className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-[#1a1a2e] focus:border-[#1e3a8a] focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20">
              <option value="">Бүх марк</option>
              {makes.map((m) => <option key={m}>{m}</option>)}
            </select>
          </div>
          {/* Model */}
          <div className="flex-1">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">Загвар</label>
            <select className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-[#1a1a2e] focus:border-[#1e3a8a] focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20">
              <option value="">Бүх загвар</option>
              {models.map((m) => <option key={m}>{m}</option>)}
            </select>
          </div>
          {/* Year From */}
          <div className="flex-1">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">Оноос</label>
            <select className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-[#1a1a2e] focus:border-[#1e3a8a] focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20">
              <option value="">Бүх он</option>
              {years.map((y) => <option key={y}>{y}</option>)}
            </select>
          </div>
          {/* Year To */}
          <div className="flex-1">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">Он хүртэл</label>
            <select className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-[#1a1a2e] focus:border-[#1e3a8a] focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20">
              <option value="">Бүх он</option>
              {years.map((y) => <option key={y}>{y}</option>)}
            </select>
          </div>
          {/* Price Range */}
          <div className="flex-1">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">Үнийн хязгаар</label>
            <select className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-[#1a1a2e] focus:border-[#1e3a8a] focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20">
              <option value="">Бүх үнэ</option>
              {priceRanges.map((p) => <option key={p}>{p}</option>)}
            </select>
          </div>
          {/* Search Button */}
          <div className="mt-5">
            <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1e3a8a] px-6 py-2.5 text-sm font-bold text-white shadow transition-colors hover:bg-[#172554] md:w-auto">
              <Search className="h-4 w-4" />
              Машин хайх
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
