import { Star } from "lucide-react"

const reviews = [
  {
    quote:
      "JapanCarsMongolia-аар дамжуулан Toyota Land Cruiser авсан бөгөөд бүх үйл явц маш жигд явагдсан. Тэдний баг надад бүх шатанд мэдэгдэж байсан. Маш их зөвлөж байна!",
    name: "Батбаяр Д.",
    city: "Улаанбаатар",
  },
  {
    quote:
      "Монгол хэлний дэмжлэг бүгдийг маш хялбар болгосон. Машин импортлох туршлагагүй байсан ч тэд төлбөрөөс хүргэлт хүртэл бүх үйл явцад надад зааж өгсөн.",
    name: "Энхжаргал Б.",
    city: "Дархан",
  },
  {
    quote:
      "Тэднээс авч буй гурав дахь машин минь. Үнэ нь үргэлж өрсөлдөхүйц бөгөөд чанар нь яг тайлбарласантай адил. Хуучин Япон машины миний гол экспортлогч.",
    name: "Гантулга М.",
    city: "Эрдэнэт",
  },
  {
    quote:
      "Хурдан, найдвартай, ил тод. Миний Alphard 7 долоо хоногт ирсэн бөгөөд төгс байдалд байсан. Гаалийн бичиг баримтыг ямар ч асуудалгүйгээр шийдвэрлэсэн.",
    name: "Оюунтуяа С.",
    city: "Улаанбаатар",
  },
  {
    quote:
      "Маш мэргэжлийн баг. Анх удаа импортлох гэж байгаадаа санаа зовж байсан ч тэд миний бүх асуултад тэвчээртэйгээр хариулсан. Машин хүлээснээс ч сайн ирсэн.",
    name: "Цэрэнпунцаг Р.",
    city: "Чойбалсан",
  },
  {
    quote:
      "Эхнээс эцэс хүртэл гайхалтай үйлчилгээ. Машины үзлэгийн тайлан надад итгэл өгсөн бөгөөд тээвэрлэлтийн хяналт аяллын туршид надад мэдэгдэж байсан.",
    name: "Номинчимэг Г.",
    city: "Улаанбаатар",
  },
]

function Stars() {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      ))}
    </div>
  )
}

export default function Testimonials() {
  return (
    <section className="w-full bg-[#f5f5f5] py-16">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-black text-[#1a1a2e] text-balance">
            Монгол үйлчлүүлэгчид манай тухай
          </h2>
          <div className="mx-auto mt-3 h-1 w-14 rounded-full bg-[#1e3a8a]" />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <div
              key={review.name}
              className="flex flex-col justify-between rounded-2xl bg-white p-6 shadow-md ring-1 ring-gray-100"
            >
              <div>
                <Stars />
                <p className="mt-4 text-sm italic leading-relaxed text-gray-600">
                  &ldquo;{review.quote}&rdquo;
                </p>
              </div>
              <div className="mt-5 flex items-center gap-3 border-t border-gray-100 pt-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1e3a8a]/10 text-sm font-bold text-[#1e3a8a]">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-[#1a1a2e]">{review.name}</p>
                  <p className="text-xs text-gray-500">{review.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
