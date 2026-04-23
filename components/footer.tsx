import { Phone, Mail, MapPin, Clock, Facebook, Instagram, MessageCircle } from "lucide-react"
import Link from "next/link"

const quickLinks = [
  { label: "Машин үзэх", href: "#stock" },
  { label: "Хэрхэн худалдан авах", href: "#how-to-buy" },
  { label: "Үйлчилгээ", href: "#services" },
  { label: "Холбоо барих", href: "#contact" },
  { label: "Бидний тухай", href: "#about" },
]

const services = [
  "Монгол руу тээвэрлэлт",
  "Далайн даатгал",
  "Гаалийн бүрдүүлэлт",
  "Худалдан авахаас өмнөх үзлэг",
  "Тээврийн хэрэгслийн бүртгэл",
  "Хаалга хүртэлх хүргэлт",
]

export default function Footer() {
  return (
    <footer className="w-full bg-[#1a1a2e] text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Col 1: Brand */}
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1e3a8a]">
                <span className="text-sm font-black text-white">JCM</span>
              </div>
              <div className="leading-tight">
                <p className="text-sm font-black tracking-tight">JAPANCARS</p>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[#1e3a8a]">Mongolia</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-white/60">
              Монголын хамгийн итгэмжлэгдсэн Япон хуучин машины экспортлогч. 2002 оноос хойш Монгол жолооч нарыг Японы чанартай тээврийн хэрэгслүүдтэй холбож байна.
            </p>
            {/* Socials */}
            <div className="mt-5 flex gap-3">
              <a
                href="#"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/70 transition hover:bg-[#1e3a8a] hover:text-white"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="#"
                aria-label="WhatsApp"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/70 transition hover:bg-[#1e3a8a] hover:text-white"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/70 transition hover:bg-[#1e3a8a] hover:text-white"
              >
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-white/40">Шуурхай холбоосууд</h3>
            <ul className="flex flex-col gap-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 transition hover:text-[#1e3a8a]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Services */}
          <div>
            <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-white/40">Үйлчилгээ</h3>
            <ul className="flex flex-col gap-3">
              {services.map((s) => (
                <li key={s} className="text-sm text-white/70">
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div>
            <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-white/40">Холбоо барих</h3>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#1e3a8a]" />
                <span className="text-sm leading-relaxed text-white/70">
                  Сүхбаатар дүүрэг, Улаанбаатар 14200, Монгол
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-[#1e3a8a]" />
                <a href="tel:+97699001234" className="text-sm text-white/70 hover:text-[#1e3a8a] transition-colors">
                  +976 9900-1234
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-[#1e3a8a]" />
                <a href="mailto:info@japancarsmongolia.com" className="text-sm text-white/70 hover:text-[#1e3a8a] transition-colors">
                  info@japancarsmongolia.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[#1e3a8a]" />
                <span className="text-sm leading-relaxed text-white/70">
                  Дав – Бям: 09:00 – 18:00<br />Ням: Амралт
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-5 lg:px-8">
          <p className="text-center text-xs text-white/40">
            &copy; {new Date().getFullYear()} JapanCarsMongolia. Бүх эрх хуулиар хамгаалагдсан. SAT Japan-тай холбоогүй.
          </p>
        </div>
      </div>
    </footer>
  )
}
