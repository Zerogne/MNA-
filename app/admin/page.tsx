"use client"

import { useState } from "react"
import {
  Car,
  MessageSquare,
  Menu,
  Plus,
  MoreHorizontal,
  Trash2,
  Pencil,
  CheckCircle2,
  XCircle,
  Eye,
} from "lucide-react"
import { carListings, CarListing } from "@/lib/cars"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

// ─── types ────────────────────────────────────────────────────────────────────

type View = "cars" | "inquiries"

interface Inquiry {
  id: number
  name: string
  email: string
  phone: string
  car: string
  message: string
  date: string
  status: "new" | "replied"
}

// ─── mock inquiry data ────────────────────────────────────────────────────────

const INQUIRIES: Inquiry[] = [
  {
    id: 1,
    name: "Батбаяр Дорж",
    email: "batbayar@gmail.com",
    phone: "+976 9900 1234",
    car: "Toyota Land Cruiser 200",
    message: "Сайн байна уу? Энэ машины талаар дэлгэрэнгүй мэдээлэл авах боломжтой юу? Тухайлбал гадаад байдал сайн байна уу?",
    date: "2025-04-22",
    status: "new",
  },
  {
    id: 2,
    name: "Мөнхбат Цэрэн",
    email: "munkhbat@yahoo.com",
    phone: "+976 8811 5678",
    car: "Toyota Alphard 2020",
    message: "Альфард машин авах сонирхолтой байна. Үнэ тохирч болох уу? Яаралтай авах шаардлагатай байна.",
    date: "2025-04-21",
    status: "replied",
  },
  {
    id: 3,
    name: "Оюунцэцэг Ган",
    email: "oyuun@gmail.com",
    phone: "+976 9955 4321",
    car: "Mazda CX-5 2022",
    message: "CX-5 машины техникийн үзүүлэлт, засвар үйлчилгээний түүхийг мэдэх боломжтой юу?",
    date: "2025-04-20",
    status: "new",
  },
  {
    id: 4,
    name: "Энхтөр Бат",
    email: "enkhtuur@hotmail.com",
    phone: "+976 9944 8765",
    car: "Toyota RAV4 Hybrid 2022",
    message: "RAV4 Hybrid авах гэж байна. Хүргэлт хэдэн хоногт болдог вэ? Манай гэр рүү хүргэж өгөх үү?",
    date: "2025-04-19",
    status: "new",
  },
  {
    id: 5,
    name: "Сарантуяа Дамба",
    email: "sarantuya@gmail.com",
    phone: "+976 9933 2109",
    car: "Honda CR-V 2021",
    message: "CR-V машины үнэ тохиромжтой байна. Зээлийн нөхцөл байдаг уу? Урьдчилгаа хэд өгвөл болох вэ?",
    date: "2025-04-18",
    status: "replied",
  },
  {
    id: 6,
    name: "Ганбаатар Лхагва",
    email: "ganbataar@gmail.com",
    phone: "+976 9911 3344",
    car: "Nissan X-Trail 2021",
    message: "X-Trail машин авахаас өмнө үзэж болох уу? Хаана байрладаг вэ?",
    date: "2025-04-17",
    status: "replied",
  },
]

// ─── sidebar ──────────────────────────────────────────────────────────────────

const NAV = [
  { id: "cars" as View, label: "Машинууд", icon: Car },
  { id: "inquiries" as View, label: "Асуулгууд", icon: MessageSquare },
]

function SidebarNav({ active, onSelect }: { active: View; onSelect: (v: View) => void }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center gap-2.5 border-b px-5">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#1e3a8a]">
          <Car className="h-4 w-4 text-white" />
        </div>
        <span className="text-sm font-bold text-slate-900">JCM Admin</span>
      </div>

      <nav className="flex-1 space-y-0.5 p-3">
        {NAV.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => onSelect(id)}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active === id
                ? "bg-[#1e3a8a] text-white"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </button>
        ))}
      </nav>
    </div>
  )
}

// ─── car form dialog ──────────────────────────────────────────────────────────

function CarFormDialog({
  open,
  onClose,
  car,
}: {
  open: boolean
  onClose: () => void
  car?: CarListing
}) {
  const isEdit = !!car
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Машин засах" : "Шинэ машин нэмэх"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Энэ жагсаалтын мэдээллийг шинэчлэх." : "Нөөцөд шинэ машин нэмэхийн тулд мэдээллийг бөглөөрэй."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Машины нэр</Label>
            <Input defaultValue={car?.name} placeholder="e.g. Toyota Prado" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Он</Label>
            <Input defaultValue={car?.year} placeholder="2022" type="number" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Үнэ (USD)</Label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-xs text-slate-400">$</span>
              <Input
                defaultValue={car?.price.replace(/[^0-9,]/g, "")}
                placeholder="21,500"
                className="pl-6"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Гүйлт</Label>
            <Input defaultValue={car?.mileage} placeholder="32,000 km" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Хөдөлгүүр</Label>
            <Input defaultValue={car?.engine} placeholder="2.7L Petrol" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Хурдны хайрцаг</Label>
            <Select defaultValue={car?.transmission ?? "Automatic"}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Automatic">Automatic</SelectItem>
                <SelectItem value="CVT">CVT</SelectItem>
                <SelectItem value="Manual">Manual</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-2 space-y-1.5">
            <Label className="text-xs">Зургийн URL</Label>
            <Input defaultValue={car?.image} placeholder="https://…" />
          </div>
          <div className="col-span-2 space-y-1.5">
            <Label className="text-xs">Төлөв</Label>
            <Select defaultValue={car?.badge ?? "NEW"}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NEW">Боломжтой</SelectItem>
                <SelectItem value="SOLD">Зарагдсан</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="mt-2 gap-2">
          <Button variant="outline" onClick={onClose}>Цуцлах</Button>
          <Button className="bg-[#1e3a8a] hover:bg-[#172554]" onClick={onClose}>
            {isEdit ? "Өөрчлөлт хадгалах" : "Машин нэмэх"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── cars page ────────────────────────────────────────────────────────────────

function CarsPage() {
  const [addOpen, setAddOpen] = useState(false)
  const [editCar, setEditCar] = useState<CarListing | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<CarListing | null>(null)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Бүх машинууд</h2>
          <p className="text-sm text-slate-500">{carListings.length} машин байна</p>
        </div>
        <Button
          size="sm"
          className="bg-[#1e3a8a] hover:bg-[#172554]"
          onClick={() => setAddOpen(true)}
        >
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Машин нэмэх
        </Button>
      </div>

      <Card className="border shadow-none">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-5">Car</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="hidden sm:table-cell">Гүйлт</TableHead>
                <TableHead className="hidden md:table-cell">Хурдны хайрцаг</TableHead>
                <TableHead>Төлөв</TableHead>
                <TableHead className="pr-5 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {carListings.map((car) => (
                <TableRow key={car.name + car.year} className="hover:bg-slate-50/60">
                  <TableCell className="pl-5">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 rounded-md">
                        <AvatarImage src={car.image} alt={car.name} className="object-cover" />
                        <AvatarFallback className="rounded-md bg-slate-100 text-[10px]">
                          {car.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-slate-800">{car.name}</p>
                        <p className="text-xs text-slate-400">{car.year}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm font-semibold text-[#1e3a8a]">
                    {car.price}
                  </TableCell>
                  <TableCell className="hidden text-sm text-slate-500 sm:table-cell">
                    {car.mileage}
                  </TableCell>
                  <TableCell className="hidden text-sm text-slate-500 md:table-cell">
                    {car.transmission}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={cn(
                        "text-[11px]",
                        car.badge === "SOLD"
                          ? "bg-slate-100 text-slate-500 hover:bg-slate-100"
                          : "bg-green-100 text-green-700 hover:bg-green-100",
                      )}
                    >
                      {car.badge === "SOLD" ? "Зарагдсан" : "Боломжтой"}
                    </Badge>
                  </TableCell>
                  <TableCell className="pr-5 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onClick={() => setEditCar(car)}>
                          <Pencil className="mr-2 h-3.5 w-3.5" />
                          Засах
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          {car.badge === "SOLD" ? (
                            <><CheckCircle2 className="mr-2 h-3.5 w-3.5" />Боломжтой болгох</>
                          ) : (
                            <><XCircle className="mr-2 h-3.5 w-3.5" />Зарагдсан болгох</>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600"
                          onClick={() => setDeleteTarget(car)}
                        >
                          <Trash2 className="mr-2 h-3.5 w-3.5" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* add car dialog */}
      <CarFormDialog open={addOpen} onClose={() => setAddOpen(false)} />

      {/* edit car dialog */}
      <CarFormDialog
        open={!!editCar}
        onClose={() => setEditCar(null)}
        car={editCar ?? undefined}
      />

      {/* delete confirmation */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Устгах уу?</DialogTitle>
            <DialogDescription>
              <span className="font-semibold">
                {deleteTarget?.year} {deleteTarget?.name}
              </span>{" "}
              нөөцөөс устгагдана. Энэ үйлдлийг буцааж болохгүй.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Цуцлах</Button>
            <Button variant="destructive" onClick={() => setDeleteTarget(null)}>Устгах</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ─── inquiries page ───────────────────────────────────────────────────────────

function InquiriesPage() {
  const [selected, setSelected] = useState<Inquiry | null>(null)

  const newCount = INQUIRIES.filter((i) => i.status === "new").length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Асуулгууд</h2>
          <p className="text-sm text-slate-500">
            {INQUIRIES.length} total
            {newCount > 0 && (
              <span className="ml-2 inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                {newCount} new
              </span>
            )}
          </p>
        </div>
      </div>

      <Card className="border shadow-none">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-5">Үйлчлүүлэгч</TableHead>
                <TableHead className="hidden sm:table-cell">Сонирхсон</TableHead>
                <TableHead className="hidden md:table-cell">Утас</TableHead>
                <TableHead>Огноо</TableHead>
                <TableHead>Төлөв</TableHead>
                <TableHead className="pr-5 text-right">Харах</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {INQUIRIES.map((inq) => (
                <TableRow key={inq.id} className="hover:bg-slate-50/60">
                  <TableCell className="pl-5">
                    <p className="text-sm font-medium text-slate-800">{inq.name}</p>
                    <p className="text-xs text-slate-400">{inq.email}</p>
                  </TableCell>
                  <TableCell className="hidden text-sm text-slate-600 sm:table-cell">
                    {inq.car}
                  </TableCell>
                  <TableCell className="hidden text-sm text-slate-500 md:table-cell">
                    {inq.phone}
                  </TableCell>
                  <TableCell className="text-sm text-slate-500">{inq.date}</TableCell>
                  <TableCell>
                    <Badge
                      className={cn(
                        "text-[11px]",
                        inq.status === "new"
                          ? "bg-blue-100 text-blue-700 hover:bg-blue-100"
                          : "bg-slate-100 text-slate-500 hover:bg-slate-100",
                      )}
                    >
                      {inq.status === "new" ? "Шинэ" : "Хариу өгсөн"}
                    </Badge>
                  </TableCell>
                  <TableCell className="pr-5 text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setSelected(inq)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* inquiry detail dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selected?.name}-ийн асуулга</DialogTitle>
            <DialogDescription>
              Хүлээн авсан: {selected?.date} — {selected?.car}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs font-medium text-slate-400">Email</p>
                <p className="mt-0.5 text-slate-800">{selected?.email}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400">Утас</p>
                <p className="mt-0.5 text-slate-800">{selected?.phone}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400">Сонирхсон</p>
                <p className="mt-0.5 text-slate-800">{selected?.car}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400">Огноо</p>
                <p className="mt-0.5 text-slate-800">{selected?.date}</p>
              </div>
            </div>
            <Separator />
            <div>
              <p className="text-xs font-medium text-slate-400">Мессеж</p>
              <p className="mt-1.5 leading-relaxed text-slate-700">{selected?.message}</p>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setSelected(null)}>Хаах</Button>
            <Button className="bg-[#1e3a8a] hover:bg-[#172554]">
              Хариу өгсөн болгох
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ─── main page ────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [view, setView] = useState<View>("cars")

  return (
    <div className="flex min-h-screen bg-slate-50">

      {/* desktop sidebar */}
      <aside className="hidden w-52 shrink-0 border-r bg-white lg:block">
        <SidebarNav active={view} onSelect={setView} />
      </aside>

      <div className="flex flex-1 flex-col">
        {/* header */}
        <header className="flex h-14 items-center justify-between border-b bg-white px-5">
          <div className="flex items-center gap-3">
            {/* mobile menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 lg:hidden">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-52 p-0">
                <SidebarNav active={view} onSelect={setView} />
              </SheetContent>
            </Sheet>
            <span className="text-sm font-semibold text-slate-900">{view === "cars" ? "Бүх машинууд" : "Асуулгууд"}</span>
          </div>
          <Badge className="bg-[#1e3a8a] text-white hover:bg-[#172554] text-[11px]">
            Админ
          </Badge>
        </header>

        {/* content */}
        <main className="flex-1 overflow-auto p-5 lg:p-7">
          {view === "cars" ? <CarsPage /> : <InquiriesPage />}
        </main>
      </div>
    </div>
  )
}
