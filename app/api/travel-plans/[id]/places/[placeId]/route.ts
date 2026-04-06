import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

interface RouteParams {
  params: Promise<{ id: string; placeId: string }>;
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const { placeId } = await params;
  const body = await request.json();

  const updates: Record<string, unknown> = {};
  if (body.name !== undefined) updates.name = body.name;
  if (body.category !== undefined) updates.category = body.category;
  if (body.address !== undefined) updates.address = body.address;
  if (body.rating !== undefined) updates.rating = body.rating;
  if (body.memo !== undefined) updates.memo = body.memo;
  if (body.visitDate !== undefined) updates.visit_date = body.visitDate;
  if (body.isVisited !== undefined) updates.is_visited = body.isVisited;

  const { data, error } = await supabase
    .from("travel_places")
    .update(updates)
    .eq("id", placeId)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    id: data.id,
    travelPlanId: data.travel_plan_id,
    name: data.name,
    category: data.category,
    address: data.address,
    rating: data.rating,
    memo: data.memo,
    visitDate: data.visit_date,
    isVisited: data.is_visited,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  });
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const { placeId } = await params;
  const { error } = await supabase.from("travel_places").delete().eq("id", placeId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
