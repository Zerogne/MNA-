// Client-side API functions — all URLs are relative, resolved by the browser.
// Server components should import from @/lib/supabase directly.

export type Car = {
  id: string
  name: string
  year: number
  price: string
  mileage: string
  engine: string
  transmission: string
  badge: 'NEW' | 'SOLD'
  image: string
  description?: string
  created_at: string
}

export type Inquiry = {
  id: string
  name: string
  email: string
  phone: string
  car?: string
  message: string
  status: 'new' | 'replied'
  created_at: string
}

export function getImageList(image: string): string[] {
  return image ? image.split('|').filter(Boolean) : []
}

export function getMainImage(image: string): string {
  return getImageList(image)[0] ?? ''
}

export function getCarSlug(car: Pick<Car, 'name' | 'year'>) {
  return `${car.name}-${car.year}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function getCarBySlug(cars: Car[], slug: string) {
  return cars.find((car) => getCarSlug(car) === slug)
}

// ─── cars ─────────────────────────────────────────────────────────────────────

export async function fetchCars(params?: Record<string, string>): Promise<Car[]> {
  const qs = new URLSearchParams()
  if (params) Object.entries(params).forEach(([k, v]) => { if (v) qs.set(k, v) })
  const res = await fetch(`/api/cars${qs.size ? `?${qs}` : ''}`)
  if (!res.ok) throw new Error('Failed to fetch cars')
  return res.json()
}

export async function createCar(data: Omit<Car, 'id' | 'created_at'>): Promise<Car> {
  const res = await fetch('/api/cars', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to create car')
  return res.json()
}

export async function updateCar(id: string, data: Partial<Omit<Car, 'id' | 'created_at'>>): Promise<Car> {
  const res = await fetch(`/api/cars/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to update car')
  return res.json()
}

export async function deleteCar(id: string): Promise<void> {
  const res = await fetch(`/api/cars/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete car')
}

// ─── inquiries ────────────────────────────────────────────────────────────────

export async function submitInquiry(
  data: Pick<Inquiry, 'name' | 'email' | 'phone' | 'message'> & { car?: string }
): Promise<Inquiry> {
  const res = await fetch('/api/inquiries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to submit inquiry')
  return res.json()
}

export async function fetchInquiries(): Promise<Inquiry[]> {
  const res = await fetch('/api/inquiries', { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch inquiries')
  return res.json()
}

export async function updateInquiryStatus(id: string, status: 'new' | 'replied'): Promise<Inquiry> {
  const res = await fetch(`/api/inquiries/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  })
  if (!res.ok) throw new Error('Failed to update inquiry')
  return res.json()
}

// ─── upload ───────────────────────────────────────────────────────────────────

export async function uploadImage(file: File): Promise<{ url: string; public_id: string }> {
  const form = new FormData()
  form.append('image', file)
  const res = await fetch('/api/upload', { method: 'POST', body: form })
  if (!res.ok) throw new Error('Failed to upload image')
  return res.json()
}
