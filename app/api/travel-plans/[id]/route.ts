import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

interface RouteParams {
  params: Promise<{ id: string }>;
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

export async function GET(_request: Request, { params }: RouteParams) {
  const { id } = await params;

  const { data, error } = await supabase
    .from("travel_plans")
    .select("*, travel_places(*)")
    .eq("id", id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });

  return NextResponse.json({
    id: data.id,
    title: data.title,
    destination: data.destination,
    startDate: data.start_date,
    endDate: data.end_date,
    budget: data.budget,
    description: data.description,
    status: data.status,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    places: (data.travel_places ?? []).map(mapPlace),
  });
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const { id } = await params;
  const body = await request.json();

  const updates: Record<string, unknown> = {};
  if (body.title !== undefined) updates.title = body.title;
  if (body.destination !== undefined) updates.destination = body.destination;
  if (body.startDate !== undefined) updates.start_date = body.startDate;
  if (body.endDate !== undefined) updates.end_date = body.endDate;
  if (body.budget !== undefined) updates.budget = body.budget;
  if (body.description !== undefined) updates.description = body.description;
  if (body.status !== undefined) updates.status = body.status;

  const { data, error } = await supabase
    .from("travel_plans")
    .update(updates)
    .eq("id", id)
    .select("*, travel_places(*)")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    id: data.id,
    title: data.title,
    destination: data.destination,
    startDate: data.start_date,
    endDate: data.end_date,
    budget: data.budget,
    description: data.description,
    status: data.status,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    places: (data.travel_places ?? []).map(mapPlace),
  });
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const { id } = await params;
  const { error } = await supabase.from("travel_plans").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
