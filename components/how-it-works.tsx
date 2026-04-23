const steps = [
  {
    number: "01",
    title: "Машин үзэх",
    description: "Марк, загвар, он, төсвөөрөө 10,000 гаруй Япон машинаас хайж олоорой.",
  },
  {
    number: "02",
    title: "Асуулга илгээх",
    description: "Асуулга илгээх эсвэл манай монгол хэлтэй багтай WhatsApp эсвэл утсаар холбоо барина уу.",
  },
  {
    number: "03",
    title: "Төлбөр хийх",
    description: "Урьдчилгаа төлбөрөөр машинаа баталгаажуулна уу. Банкны шилжүүлэг болон орон нутгийн төлбөрийн аргуудыг хүлээн авна.",
  },
  {
    number: "04",
    title: "Машинаа хүлээн авах",
    description: "Тээвэрлэлт, гаалийн бүрдүүлэлт, Улаанбаатарт шууд хүргэлтийг бид зохион байгуулна.",
  },
]

export default function HowItWorks() {
  return (
    <section id="how-to-buy" className="w-full bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-14 text-center">
          <h2 className="text-3xl font-black text-[#1a1a2e] text-balance">
            4 алхамаар хэрхэн худалдан авах вэ
          </h2>
          <div className="mx-auto mt-3 h-1 w-14 rounded-full bg-[#1e3a8a]" />
        </div>

        <div className="relative grid grid-cols-1 gap-10 md:grid-cols-4 md:gap-6">
          {/* Connector line (desktop) */}
          <div className="absolute left-[12.5%] right-[12.5%] top-8 hidden h-0.5 bg-gray-200 md:block" />

          {steps.map((step, i) => (
            <div key={step.number} className="relative flex flex-col items-center text-center">
              {/* Circle */}
              <div className="relative z-10 mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#1e3a8a] shadow-lg shadow-[#1e3a8a]/30">
                <span className="text-lg font-black text-white">{step.number}</span>
              </div>
              {/* Arrow between steps (desktop) */}
              {i < steps.length - 1 && (
                <div className="absolute -right-3 top-6 z-20 hidden text-[#1e3a8a] md:block">
                  <svg width="12" height="16" viewBox="0 0 12 16" fill="none">
                    <path d="M0 0L12 8L0 16V0Z" fill="#1e3a8a" />
                  </svg>
                </div>
              )}
              <h3 className="mb-2 text-base font-bold text-[#1a1a2e]">{step.title}</h3>
              <p className="text-sm leading-relaxed text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
