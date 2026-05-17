import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const s = request.nextUrl.searchParams
  const brand  = s.get('brand')
  const search = s.get('search')
  const yearMin = s.get('yearMin')
  const yearMax = s.get('yearMax')
  const status  = s.get('status')

  let query = supabase.from('cars').select('*').order('created_at', { ascending: false })
  if (brand)   query = query.ilike('name', `${brand}%`)
  if (search)  query = query.ilike('name', `%${search}%`)
  if (yearMin) query = query.gte('year', Number(yearMin))
  if (yearMax) query = query.lte('year', Number(yearMax))
  if (status === 'available') query = query.eq('badge', 'NEW')
  if (status === 'sold')      query = query.eq('badge', 'SOLD')

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const { name, year, price, mileage, engine, transmission, badge, image } = await request.json()
  const { data, error } = await supabase
    .from('cars')
    .insert({ name, year: Number(year), price, mileage, engine, transmission, badge: badge ?? 'NEW', image })
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
