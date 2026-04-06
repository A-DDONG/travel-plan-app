import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, { params }: RouteParams) {
  const { id } = await params;
  const body = await request.json();

  const { data, error } = await supabase
    .from("travel_places")
    .insert({
      travel_plan_id: id,
      name: body.name,
      category: body.category,
      address: body.address ?? "",
      rating: body.rating ?? 0,
      memo: body.memo ?? "",
      visit_date: body.visitDate,
      is_visited: body.isVisited ?? false,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(
    {
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
    },
    { status: 201 }
  );
}
