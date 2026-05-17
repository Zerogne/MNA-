-- Run this in your Supabase SQL editor

CREATE TABLE cars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  year INTEGER NOT NULL,
  price TEXT NOT NULL,
  mileage TEXT NOT NULL,
  engine TEXT NOT NULL,
  transmission TEXT NOT NULL,
  badge TEXT NOT NULL DEFAULT 'NEW' CHECK (badge IN ('NEW', 'SOLD')),
  image TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  car TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'replied')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed with the existing inventory
INSERT INTO cars (name, year, price, mileage, engine, transmission, badge, image) VALUES
  ('Toyota Land Cruiser 200', 2019, '$28,500', '65,000 km', '4.5L V8',      'Automatic', 'NEW',  'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80'),
  ('Toyota Alphard',          2020, '$22,000', '45,000 km', '2.5L Hybrid',  'CVT',       'NEW',  'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=600&q=80'),
  ('Nissan X-Trail',          2021, '$18,500', '30,000 km', '2.0L',         'Automatic', 'NEW',  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80'),
  ('Toyota Harrier',          2020, '$19,800', '42,000 km', '2.0L Turbo',   'Automatic', 'SOLD', 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=600&q=80'),
  ('Toyota RAV4 Hybrid',      2022, '$24,900', '18,000 km', '2.5L Hybrid',  'Automatic', 'NEW',  'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=600&q=80'),
  ('Honda CR-V',              2021, '$17,200', '55,000 km', '1.5L Turbo',   'CVT',       'NEW',  'https://images.unsplash.com/photo-1469285994282-454ceb49e63c?auto=format&fit=crop&w=600&q=80'),
  ('Mazda CX-5',              2022, '$20,400', '22,000 km', '2.5L',         'Automatic', 'NEW',  'https://images.unsplash.com/photo-1546614042-7df3c24c9e5d?auto=format&fit=crop&w=600&q=80'),
  ('Mitsubishi Outlander',    2020, '$16,800', '48,000 km', '2.4L PHEV',    'Automatic', 'NEW',  'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=600&q=80');
