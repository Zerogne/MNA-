"use client"

import { useState } from "react"
import { Send } from "lucide-react"

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section id="contact" className="w-full bg-gradient-to-b from-white to-[#f8f9fc] py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-black text-[#1a1a2e] text-balance md:text-4xl">
            Машин авах сонирхолтой байна уу? Холбоо барина уу
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-gray-600 md:text-base">
            Маягтыг бөглөөрэй, манай монгол хэлтэй баг 24 цагийн дотор танд хариу өгнө.
          </p>
          <div className="mx-auto mt-4 h-1 w-14 rounded-full bg-[#1e3a8a]" />
        </div>

        {submitted ? (
          <div className="rounded-2xl bg-green-50 p-10 text-center ring-1 ring-green-200">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
              <Send className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-green-800">Асуулга илгээгдлээ!</h3>
            <p className="mt-2 text-sm text-green-700">
              Баярлалаа! Манай баг 24 цагийн дотор танд холбоо барина.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.05fr_1fr] lg:items-stretch">
            <div className="hidden overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm lg:block">
              <iframe
                title="Office location map"
                src="https://www.google.com/maps?q=Ulaanbaatar,+Mongolia&output=embed"
                className="h-[320px] w-full md:h-[420px] lg:h-full lg:min-h-[560px]"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-6"
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Бүтэн нэр *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Батбаяр Дорж"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-[#1a1a2e] placeholder-gray-400 transition focus:border-[#1e3a8a] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Имэйл хаяг *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-[#1a1a2e] placeholder-gray-400 transition focus:border-[#1e3a8a] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Утас / WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+976 9900 1234"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-[#1a1a2e] placeholder-gray-400 transition focus:border-[#1e3a8a] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Хүссэн машин (Марк / Загвар)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Toyota Land Cruiser 2020"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-[#1a1a2e] placeholder-gray-400 transition focus:border-[#1e3a8a] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Мессеж
                </label>
                <textarea
                  rows={4}
                  placeholder="Төсөв, хүссэн өнгө, тусгай шаардлагаа бидэнд хэлнэ үү..."
                  className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-[#1a1a2e] placeholder-gray-400 transition focus:border-[#1e3a8a] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20"
                />
              </div>

              <button
                type="submit"
                className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-[#1e3a8a] py-4 text-sm font-bold text-white shadow-md shadow-[#1e3a8a]/30 transition-all hover:-translate-y-0.5 hover:bg-[#172554] hover:shadow-lg"
              >
                <Send className="h-4 w-4" />
                Асуулга илгээх
              </button>
            </form>
          </div>
        )}
      </div>
    </section>
  )
}
