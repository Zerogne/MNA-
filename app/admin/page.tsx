"use client"

import { useEffect, useRef, useState } from "react"
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
  ImagePlus,
  X,
} from "lucide-react"
import {
  fetchCars,
  fetchInquiries,
  createCar,
  updateCar,
  deleteCar,
  updateInquiryStatus,
  uploadImage,
  getMainImage,
  type Car as CarType,
  type Inquiry,
} from "@/lib/api"
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

type CarFormState = {
  name: string
  year: string
  price: string
  mileage: string
  engine: string
  transmission: string
  badge: "NEW" | "SOLD"
  image: string
  description: string
}

const EMPTY_FORM: CarFormState = {
  name: "",
  year: "",
  price: "",
  mileage: "",
  engine: "",
  transmission: "Automatic",
  badge: "NEW",
  image: "",
  description: "",
}

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
  onSaved,
}: {
  open: boolean
  onClose: () => void
  car?: CarType
  onSaved: (car: CarType) => void
}) {
  const isEdit = !!car
  const [form, setForm] = useState<CarFormState>(EMPTY_FORM)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setForm(
        car
          ? {
              name: car.name,
              year: String(car.year),
              price: car.price.replace(/[^0-9,]/g, ""),
              mileage: car.mileage,
              engine: car.engine,
              transmission: car.transmission,
              badge: car.badge,
              image: car.image,
              description: car.description ?? "",
            }
          : EMPTY_FORM
      )
    }
  }, [open, car])

  const set = (k: keyof CarFormState, v: string) => setForm((p) => ({ ...p, [k]: v }))

  const imageList = form.image ? form.image.split('|').filter(Boolean) : []

  const handleImageFiles = async (files: FileList) => {
    const fileArray = Array.from(files)
    if (fileRef.current) fileRef.current.value = ""
    setUploading(true)
    try {
      const results = await Promise.allSettled(fileArray.map((f) => uploadImage(f)))
      const newUrls = results
        .filter((r): r is PromiseFulfilledResult<{ url: string; public_id: string }> => r.status === "fulfilled")
        .map((r) => r.value.url)
      if (newUrls.length > 0) {
        setForm((prev) => {
          const existing = prev.image ? prev.image.split("|").filter(Boolean) : []
          return { ...prev, image: [...existing, ...newUrls].join("|") }
        })
      }
      const failed = results.filter((r) => r.status === "rejected").length
      if (failed > 0) alert(`${failed} зураг оруулахад алдаа гарлаа.`)
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (index: number) => {
    set("image", imageList.filter((_, i) => i !== index).join('|'))
  }

  const handleSubmit = async () => {
    setSaving(true)
    try {
      const payload = {
        name: form.name,
        year: Number(form.year),
        price: form.price.startsWith("$") ? form.price : `$${form.price}`,
        mileage: form.mileage,
        engine: form.engine,
        transmission: form.transmission,
        badge: form.badge,
        image: form.image,
        description: form.description,
      }
      const saved = isEdit
        ? await updateCar(car!.id, payload)
        : await createCar(payload)
      onSaved(saved)
      onClose()
    } catch {
      alert("Хадгалахад алдаа гарлаа.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Машин засах" : "Шинэ машин нэмэх"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Энэ жагсаалтын мэдээллийг шинэчлэх."
              : "Нөөцөд шинэ машин нэмэхийн тулд мэдээллийг бөглөөрэй."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Машины нэр</Label>
            <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Toyota Prado" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Он</Label>
            <Input value={form.year} onChange={(e) => set("year", e.target.value)} placeholder="2022" type="number" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Үнэ (USD)</Label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-xs text-slate-400">$</span>
              <Input value={form.price} onChange={(e) => set("price", e.target.value)} placeholder="21,500" className="pl-6" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Гүйлт</Label>
            <Input value={form.mileage} onChange={(e) => set("mileage", e.target.value)} placeholder="32,000 km" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Хөдөлгүүр</Label>
            <Input value={form.engine} onChange={(e) => set("engine", e.target.value)} placeholder="2.7L Petrol" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Хурдны хайрцаг</Label>
            <Select value={form.transmission} onValueChange={(v) => set("transmission", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Automatic">Automatic</SelectItem>
                <SelectItem value="CVT">CVT</SelectItem>
                <SelectItem value="Manual">Manual</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Image upload */}
          <div className="col-span-2 space-y-1.5">
            <Label className="text-xs">Зурагнууд</Label>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => { if (e.target.files?.length) handleImageFiles(e.target.files) }}
            />

            {/* Integrated image grid — add button is always the last cell */}
            <div className="grid grid-cols-2 gap-3">
              {imageList.map((url, i) => (
                <div key={i} className="relative aspect-video overflow-hidden rounded-xl bg-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" className="h-full w-full object-cover" />
                  {i === 0 && (
                    <span className="absolute left-2 top-2 rounded-full bg-[#1e3a8a] px-2 py-0.5 text-[10px] font-bold text-white shadow">
                      Үндсэн
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    disabled={uploading}
                    className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/55 text-white transition-colors hover:bg-red-600 disabled:opacity-50"
                    aria-label="Устгах"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}

              {/* Add-more button: spans 2 cols when image count is even (fills row), 1 col when odd (pairs with last image) */}
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className={cn(
                  "flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 text-gray-400 transition-colors hover:border-[#1e3a8a]/40 hover:text-[#1e3a8a] active:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60",
                  imageList.length % 2 === 0 ? "col-span-2 py-8" : "aspect-video",
                )}
              >
                {uploading ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#1e3a8a] border-t-transparent" />
                    <span className="text-xs font-medium text-[#1e3a8a]">Cloudinary руу оруулж байна…</span>
                  </>
                ) : (
                  <>
                    <ImagePlus className="h-5 w-5" />
                    <span className="text-xs font-semibold">
                      {imageList.length === 0 ? "Зураг оруулах" : "Нэмэх"}
                    </span>
                    {imageList.length === 0 && (
                      <span className="text-[11px] text-gray-400">JPG · PNG · WEBP · Олон зураг</span>
                    )}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="col-span-2 space-y-1.5">
            <Label className="text-xs">Тайлбар (заавал биш)</Label>
            <Textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Машины дэлгэрэнгүй тайлбар, онцлог шинж чанарууд…"
              rows={3}
              className="resize-none text-sm"
            />
          </div>

          <div className="col-span-2 space-y-1.5">
            <Label className="text-xs">Төлөв</Label>
            <Select value={form.badge} onValueChange={(v) => set("badge", v as "NEW" | "SOLD")}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="NEW">Боломжтой</SelectItem>
                <SelectItem value="SOLD">Зарагдсан</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="mt-2 gap-2">
          <Button variant="outline" onClick={onClose}>Цуцлах</Button>
          <Button
            className="bg-[#1e3a8a] hover:bg-[#172554]"
            onClick={handleSubmit}
            disabled={saving || uploading}
          >
            {saving ? "Хадгалж байна…" : isEdit ? "Өөрчлөлт хадгалах" : "Машин нэмэх"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── cars view ────────────────────────────────────────────────────────────────

function CarsView({
  cars,
  setCars,
}: {
  cars: CarType[]
  setCars: React.Dispatch<React.SetStateAction<CarType[]>>
}) {
  const [addOpen, setAddOpen] = useState(false)
  const [editCar, setEditCar] = useState<CarType | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<CarType | null>(null)
  const [deleting, setDeleting] = useState(false)

  const handleSaved = (saved: CarType) => {
    setCars((prev) => {
      const idx = prev.findIndex((c) => c.id === saved.id)
      return idx >= 0 ? prev.map((c) => (c.id === saved.id ? saved : c)) : [saved, ...prev]
    })
  }

  const handleToggleBadge = async (car: CarType) => {
    const updated = await updateCar(car.id, { badge: car.badge === "SOLD" ? "NEW" : "SOLD" })
    setCars((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteCar(deleteTarget.id)
      setCars((prev) => prev.filter((c) => c.id !== deleteTarget.id))
      setDeleteTarget(null)
    } catch {
      alert("Устгахад алдаа гарлаа.")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Бүх машинууд</h2>
          <p className="text-sm text-slate-500">{cars.length} машин байна</p>
        </div>
        <Button size="sm" className="bg-[#1e3a8a] hover:bg-[#172554]" onClick={() => setAddOpen(true)}>
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
              {cars.map((car) => (
                <TableRow key={car.id} className="hover:bg-slate-50/60">
                  <TableCell className="pl-5">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 rounded-md">
                        <AvatarImage src={getMainImage(car.image)} alt={car.name} className="object-cover" />
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
                  <TableCell className="text-sm font-semibold text-[#1e3a8a]">{car.price}</TableCell>
                  <TableCell className="hidden text-sm text-slate-500 sm:table-cell">{car.mileage}</TableCell>
                  <TableCell className="hidden text-sm text-slate-500 md:table-cell">{car.transmission}</TableCell>
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
                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuItem onClick={() => setEditCar(car)}>
                          <Pencil className="mr-2 h-3.5 w-3.5" />
                          Засах
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleBadge(car)}>
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
                          Устгах
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

      <CarFormDialog open={addOpen} onClose={() => setAddOpen(false)} onSaved={handleSaved} />
      <CarFormDialog open={!!editCar} onClose={() => setEditCar(null)} car={editCar ?? undefined} onSaved={handleSaved} />

      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Устгах уу?</DialogTitle>
            <DialogDescription>
              <span className="font-semibold">{deleteTarget?.year} {deleteTarget?.name}</span>{" "}
              нөөцөөс устгагдана. Энэ үйлдлийг буцааж болохгүй.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Цуцлах</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? "Устгаж байна…" : "Устгах"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ─── inquiries view ───────────────────────────────────────────────────────────

function InquiriesView({
  inquiries,
  setInquiries,
}: {
  inquiries: Inquiry[]
  setInquiries: React.Dispatch<React.SetStateAction<Inquiry[]>>
}) {
  const [selected, setSelected] = useState<Inquiry | null>(null)
  const [marking, setMarking] = useState(false)

  const newCount = inquiries.filter((i) => i.status === "new").length

  const handleMarkReplied = async () => {
    if (!selected) return
    setMarking(true)
    try {
      const updated = await updateInquiryStatus(selected.id, "replied")
      setInquiries((prev) => prev.map((i) => (i.id === updated.id ? updated : i)))
      setSelected(updated)
    } catch {
      alert("Алдаа гарлаа.")
    } finally {
      setMarking(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Асуулгууд</h2>
          <p className="text-sm text-slate-500">
            {inquiries.length} total
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
              {inquiries.map((inq) => (
                <TableRow key={inq.id} className="hover:bg-slate-50/60">
                  <TableCell className="pl-5">
                    <p className="text-sm font-medium text-slate-800">{inq.name}</p>
                    <p className="text-xs text-slate-400">{inq.email}</p>
                  </TableCell>
                  <TableCell className="hidden text-sm text-slate-600 sm:table-cell">{inq.car}</TableCell>
                  <TableCell className="hidden text-sm text-slate-500 md:table-cell">{inq.phone}</TableCell>
                  <TableCell className="text-sm text-slate-500">
                    {new Date(inq.created_at).toLocaleDateString()}
                  </TableCell>
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
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelected(inq)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selected?.name}-ийн асуулга</DialogTitle>
            <DialogDescription>
              Хүлээн авсан: {selected ? new Date(selected.created_at).toLocaleDateString() : ""} — {selected?.car}
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
                <p className="mt-0.5 text-slate-800">{selected?.car || "—"}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400">Огноо</p>
                <p className="mt-0.5 text-slate-800">
                  {selected ? new Date(selected.created_at).toLocaleDateString() : ""}
                </p>
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
            {selected?.status === "new" && (
              <Button
                className="bg-[#1e3a8a] hover:bg-[#172554]"
                onClick={handleMarkReplied}
                disabled={marking}
              >
                {marking ? "Хадгалж байна…" : "Хариу өгсөн болгох"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ─── main page ────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [view, setView] = useState<View>("cars")
  const [cars, setCars] = useState<CarType[]>([])
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([fetchCars(), fetchInquiries()])
      .then(([c, i]) => { setCars(c); setInquiries(i) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

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
            <span className="text-sm font-semibold text-slate-900">
              {view === "cars" ? "Бүх машинууд" : "Асуулгууд"}
            </span>
          </div>
          <Badge className="bg-[#1e3a8a] text-white hover:bg-[#172554] text-[11px]">Админ</Badge>
        </header>

        {/* content */}
        <main className="flex-1 overflow-auto p-5 lg:p-7">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-12 animate-pulse rounded-lg bg-slate-100" />
              ))}
            </div>
          ) : view === "cars" ? (
            <CarsView cars={cars} setCars={setCars} />
          ) : (
            <InquiriesView inquiries={inquiries} setInquiries={setInquiries} />
          )}
        </main>
      </div>
    </div>
  )
}
