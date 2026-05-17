"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Car, House, MessageCircle, Phone } from "lucide-react"

const navLinks = [
  { label: "Нүүр", href: "/" },
  { label: "Машин", href: "/cars" },
]

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const smoothScrollToSection = (hash: string) => {
    const sectionId = hash.replace("#", "")
    const target = document.getElementById(sectionId)
    if (!target) return

    const headerOffset = 86
    const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerOffset
    window.scrollTo({ top: targetPosition, behavior: "smooth" })
  }

  const navigateToHashSection = (hash: string) => {
    if (pathname === "/") {
      smoothScrollToSection(hash)
      return
    }

    sessionStorage.setItem("pendingScrollTarget", hash)
    router.push("/")
  }

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (pathname !== "/") return

    const pendingTarget = sessionStorage.getItem("pendingScrollTarget")
    if (!pendingTarget) return

    const timer = window.setTimeout(() => {
      smoothScrollToSection(pendingTarget)
      sessionStorage.removeItem("pendingScrollTarget")
    }, 120)

    return () => window.clearTimeout(timer)
  }, [pathname])

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full bg-white transition-shadow duration-200 ${
          isScrolled ? "shadow-md" : "shadow-sm border-b border-gray-100"
        }`}
      >
        <div className="mx-auto flex h-[70px] max-w-[1280px] items-center justify-between px-4 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1e3a8a]">
            <span className="text-sm font-black text-white">JCM</span>
          </div>
          <div className="leading-tight">
            <p className="text-sm font-black tracking-tight text-[#1a1a2e]">JAPANCARS</p>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[#1e3a8a]">Mongolia</p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            link.href.startsWith("/#") ? (
              <button
                key={link.label}
                type="button"
                onClick={() => navigateToHashSection(link.href.replace("/", ""))}
                className="text-sm font-medium text-[#1a1a2e] transition-colors hover:text-[#1e3a8a]"
              >
                {link.label}
              </button>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-[#1a1a2e] transition-colors hover:text-[#1e3a8a]"
              >
                {link.label}
              </Link>
            )
          ))}
        </nav>

        {/* Desktop Right */}
        <div className="hidden items-center gap-4 lg:flex">
          <a
            href="tel:+97699001234"
            className="flex items-center gap-2 text-sm font-semibold text-[#1a1a2e] hover:text-[#1e3a8a] transition-colors"
          >
            <Phone className="h-4 w-4 text-[#1e3a8a]" />
            +976 9900-1234
          </a>
          <button
            type="button"
            onClick={() => navigateToHashSection("#contact")}
            className="rounded-lg bg-[#1e3a8a] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#172554]"
          >
            Холбоо барих
          </button>
        </div>

        {/* Mobile quick action */}
       
        </div>
      </header>

    {/* Mobile bottom/footer navigation */}
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90 lg:hidden">
        <div className="mx-auto grid h-16 max-w-[1280px] grid-cols-3 px-2">
        <Link
          href="/"
          className={`flex flex-col items-center justify-center gap-1 rounded-md text-[11px] font-semibold transition-colors ${
            pathname === "/" ? "text-[#1e3a8a]" : "text-[#1a1a2e]/70 hover:text-[#1e3a8a]"
          }`}
        >
          <House className="h-4 w-4" />
          Нүүр
        </Link>
        <Link
          href="/cars"
          className={`flex flex-col items-center justify-center gap-1 rounded-md text-[11px] font-semibold transition-colors ${
            pathname.startsWith("/cars") ? "text-[#1e3a8a]" : "text-[#1a1a2e]/70 hover:text-[#1e3a8a]"
          }`}
        >
          <Car className="h-4 w-4" />
          Машинууд
        </Link>
        <button
          type="button"
          onClick={() => navigateToHashSection("#contact")}
          className="flex flex-col items-center justify-center gap-1 rounded-md text-[11px] font-semibold text-[#1a1a2e]/70 transition-colors hover:text-[#1e3a8a]"
        >
          <MessageCircle className="h-4 w-4" />
          Холбоо барих
        </button>
        
        </div>
      </nav>

      <div className="h-16 lg:hidden" aria-hidden />
    </>
  )
}
