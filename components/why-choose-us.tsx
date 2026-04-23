import { Car, ShieldCheck, Ship, MessageCircle } from "lucide-react"

const reasons = [
  {
    icon: Car,
    title: "Японы дуусгавар зарах газраас шууд",
    description:
      "Бид бүх тээврийн хэрэгслийг Японы хамгийн том машины дуусгавар зарах газруудаас шууд олж авдаг — зуучгүй, нэмэлт мөнгөгүй.",
  },
  {
    icon: ShieldCheck,
    title: "Чанарын шалгалт хийгдсэн",
    description:
      "Таны авах машин чанартай байхын тулд худалдан авахаас өмнө бүх тээврийн хэрэгсэл дэлгэрэнгүй олон цэгийн үзлэгт хамрагдана.",
  },
  {
    icon: Ship,
    title: "Улаанбаатарт хурдан хүргэлт",
    description:
      "Йокохама боомтоос Тяньжин хүртэл шууд далайн тээвэр, дараа нь хуурай замаар Улаанбаатар хүртэл. Ердийн дамжин өнгөрөх хугацаа: 6–8 долоо хоног.",
  },
  {
    icon: MessageCircle,
    title: "Монгол хэлний дэмжлэг",
    description:
      "Манай монгол хэлтэй баг машин харахаас хүргэлт хүртэл бүх алхамд танд туслана.",
  },
]

export default function WhyChooseUs() {
  return (
    <section id="services" className="w-full bg-[#fafafa] py-16">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-black text-[#1a1a2e] text-balance">
            Яагаад Монгол үйлчлүүлэгчид бидэнд итгэдэг вэ
          </h2>
          <div className="mx-auto mt-3 h-1 w-14 rounded-full bg-[#1e3a8a]" />
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((reason) => {
            const Icon = reason.icon
            return (
              <div key={reason.title} className="flex flex-col items-center text-center">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1e3a8a]/10">
                  <Icon className="h-8 w-8 text-[#1e3a8a]" />
                </div>
                <h3 className="mb-2 text-base font-bold text-[#1a1a2e]">{reason.title}</h3>
                <p className="text-sm leading-relaxed text-gray-600">{reason.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
