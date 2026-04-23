export type CarListing = {
  name: string
  year: number
  price: string
  mileage: string
  engine: string
  transmission: string
  badge: "NEW" | "SOLD"
  image: string
}

export const carListings: CarListing[] = [
  {
    name: "Toyota Land Cruiser 200",
    year: 2019,
    price: "$28,500",
    mileage: "65,000 km",
    engine: "4.5L V8",
    transmission: "Automatic",
    badge: "NEW",
    image:
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Toyota Alphard",
    year: 2020,
    price: "$22,000",
    mileage: "45,000 km",
    engine: "2.5L Hybrid",
    transmission: "CVT",
    badge: "NEW",
    image:
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Nissan X-Trail",
    year: 2021,
    price: "$18,500",
    mileage: "30,000 km",
    engine: "2.0L",
    transmission: "Automatic",
    badge: "NEW",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Toyota Harrier",
    year: 2020,
    price: "$19,800",
    mileage: "42,000 km",
    engine: "2.0L Turbo",
    transmission: "Automatic",
    badge: "SOLD",
    image:
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Toyota RAV4 Hybrid",
    year: 2022,
    price: "$24,900",
    mileage: "18,000 km",
    engine: "2.5L Hybrid",
    transmission: "Automatic",
    badge: "NEW",
    image:
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Honda CR-V",
    year: 2021,
    price: "$17,200",
    mileage: "55,000 km",
    engine: "1.5L Turbo",
    transmission: "CVT",
    badge: "NEW",
    image:
      "https://images.unsplash.com/photo-1469285994282-454ceb49e63c?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Mazda CX-5",
    year: 2022,
    price: "$20,400",
    mileage: "22,000 km",
    engine: "2.5L",
    transmission: "Automatic",
    badge: "NEW",
    image:
      "https://images.unsplash.com/photo-1546614042-7df3c24c9e5d?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Mitsubishi Outlander",
    year: 2020,
    price: "$16,800",
    mileage: "48,000 km",
    engine: "2.4L PHEV",
    transmission: "Automatic",
    badge: "NEW",
    image:
      "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=600&q=80",
  },
]

export const getCarSlug = (car: CarListing) =>
  `${car.name}-${car.year}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

export const getCarBySlug = (slug: string) =>
  carListings.find((car) => getCarSlug(car) === slug)
