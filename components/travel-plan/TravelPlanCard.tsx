"use client";

import { useRouter } from "next/navigation";
import { TravelPlan, TravelStatus } from "@/types";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Wallet, Trash2, Pencil } from "lucide-react";

const statusVariant: Record<TravelStatus, "default" | "warning" | "success" | "secondary"> = {
  계획중: "default",
  예약완료: "warning",
  여행중: "success",
  완료: "secondary",
};

interface TravelPlanCardProps {
  plan: TravelPlan;
  onEdit: (plan: TravelPlan) => void;
  onDelete: (id: string) => void;
}

export function TravelPlanCard({ plan, onEdit, onDelete }: TravelPlanCardProps) {
  const router = useRouter();
  const visitedCount = plan.places.filter((p) => p.isVisited).length;

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push(`/travel-plans/${plan.id}`)}>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base">{plan.title}</CardTitle>
          <Badge variant={statusVariant[plan.status]}>{plan.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-blue-500" />
          <span>{plan.destination}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-blue-500" />
          <span>{plan.startDate} ~ {plan.endDate}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Wallet className="h-3.5 w-3.5 text-blue-500" />
          <span>{plan.budget.toLocaleString()}원</span>
        </div>
        {plan.places.length > 0 && (
          <p className="text-xs text-gray-400">
            장소 {plan.places.length}개 · 방문 완료 {visitedCount}개
          </p>
        )}
      </CardContent>
      <CardFooter className="gap-2 justify-end">
        <Button
          size="sm"
          variant="outline"
          onClick={(e) => { e.stopPropagation(); onEdit(plan); }}
        >
          <Pencil className="h-3.5 w-3.5" />
          수정
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={(e) => { e.stopPropagation(); onDelete(plan.id); }}
        >
          <Trash2 className="h-3.5 w-3.5" />
          삭제
        </Button>
      </CardFooter>
    </Card>
  );
}
