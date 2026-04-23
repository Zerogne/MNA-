import { CheckCircle2 } from "lucide-react"

const bullets = [
  "Японы Йокохама боомтоос тээвэрлэнэ",
  "Тяньжин хүртэл шууд далайн тээвэр, дараа нь хуурай замаар Улаанбаатар хүртэл",
  "Дундаж дамжин өнгөрөх хугацаа: 6–8 долоо хоног",
  "Гаалийн бүрдүүлэлтийн бүрэн туслалцаа багтсан",
  "Монголд импортлоход тээврийн хэрэгслийн насны хязгаарлалт байхгүй",
  "Бодит цагийн тээвэрлэлт хянах боломж олгоно",
]

const infoCards = [
  { label: "Ачааны боомт", value: "Йокохама, Япон" },
  { label: "Очих газар", value: "Улаанбаатар, Монгол" },
  { label: "Дамжих хугацаа", value: "6–8 долоо хоног" },
  { label: "Гаалийн татвар", value: "Туслалцаа багтсан" },
  { label: "НӨАТ", value: "Импортын үнийн 10%" },
  { label: "Насны хязгаар", value: "Монголд байхгүй" },
]

export default function ShippingInfo() {
  return (
    <section className="w-full bg-[#172554] py-14">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16 lg:items-center">
          {/* Left */}
          <div>
            <h2 className="text-3xl font-black leading-tight text-white text-balance">
              Бид Монгол руу шууд тээвэрлэнэ
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/80">
              Японы тэргүүлэх дуусгавар зарах газруудаас Улаанбаатар дахь таны хаалганд хүртэл — аяллын бүх алхамыг бид зохион байгуулна.
            </p>
            <ul className="mt-8 flex flex-col gap-3">
              {bullets.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-white/80" />
                  <span className="text-sm leading-relaxed text-white/90">{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right — info card */}
          <div className="rounded-2xl bg-white p-7 shadow-2xl">
            <h3 className="mb-5 text-lg font-black text-[#1a1a2e]">Тээвэрлэлтийн товч мэдээлэл</h3>
            <div className="flex flex-col gap-3">
              {infoCards.map((item) => (
                <div key={item.label} className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                  <span className="text-sm font-medium text-gray-500">{item.label}</span>
                  <span className="text-sm font-bold text-[#1a1a2e]">{item.value}</span>
                </div>
              ))}
            </div>
            <a
              href="#contact"
              className="mt-6 block w-full rounded-xl bg-[#1e3a8a] py-3 text-center text-sm font-bold text-white transition-colors hover:bg-[#172554]"
            >
              Тээвэрлэлтийн үнэ авах
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
