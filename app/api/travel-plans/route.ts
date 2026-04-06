import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

export async function GET() {
  const { data, error } = await supabase
    .from("travel_plans")
    .select("*, travel_places(*)")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const plans = (data ?? []).map((p) => ({
    id: p.id,
    title: p.title,
    destination: p.destination,
    startDate: p.start_date,
    endDate: p.end_date,
    budget: p.budget,
    description: p.description,
    status: p.status,
    createdAt: p.created_at,
    updatedAt: p.updated_at,
    places: (p.travel_places ?? []).map(mapPlace),
  }));

  return NextResponse.json(plans);
}

export async function POST(request: Request) {
  const body = await request.json();

  const { data, error } = await supabase
    .from("travel_plans")
    .insert({
      title: body.title,
      destination: body.destination,
      start_date: body.startDate,
      end_date: body.endDate,
      budget: body.budget,
      description: body.description ?? "",
      status: body.status ?? "계획중",
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ...mapPlan(data), places: [] }, { status: 201 });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapPlan(p: any) {
  return {
    id: p.id,
    title: p.title,
    destination: p.destination,
    startDate: p.start_date,
    endDate: p.end_date,
    budget: p.budget,
    description: p.description,
    status: p.status,
    createdAt: p.created_at,
    updatedAt: p.updated_at,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapPlace(p: any) {
  return {
    id: p.id,
    travelPlanId: p.travel_plan_id,
    name: p.name,
    category: p.category,
    address: p.address,
    rating: p.rating,
    memo: p.memo,
    visitDate: p.visit_date,
    isVisited: p.is_visited,
    createdAt: p.created_at,
    updatedAt: p.updated_at,
  };
}
