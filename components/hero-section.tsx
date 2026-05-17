import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

export default function HeroSection() {
  return (
    <section className="relative min-h-[560px] w-full flex items-center overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1920&q=80"
        alt=""
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a2e]/90 via-[#1a1a2e]/70 to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-20 lg:px-8">
        <div className="max-w-xl">
          {/* Badge */}
          

          {/* Heading */}
          <h1 className="mb-4 text-4xl font-black leading-tight text-white text-balance md:text-5xl lg:text-6xl">
            Өөрт тохирсон Япон машинаа олоорой
          </h1>

          {/* Subtext */}
          <p className="mb-8 text-lg leading-relaxed text-white/80">
            Чанартай хуучин машиныг шууд Улаанбаатарт хүргэнэ. Зуучгүй.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4">
            <Link
              href="#stock"
              className="inline-flex items-center gap-2 rounded-xl bg-[#1e3a8a] px-7 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:bg-[#172554] hover:shadow-xl"
            >
              Машин үзэх
              <ArrowRight className="h-4 w-4" />
            </Link>
           
          </div>
        </div>
      </div>
    </section>
  )
}
