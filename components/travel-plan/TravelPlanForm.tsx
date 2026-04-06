"use client";

import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { travelPlanSchema, TravelPlanFormValues } from "@/lib/validations/travel";
import { TravelPlan } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";

interface TravelPlanFormProps {
  defaultValues?: Partial<TravelPlan>;
  onSubmit: (data: TravelPlanFormValues) => Promise<void>;
  onCancel: () => void;
  isEditing?: boolean;
}

export function TravelPlanForm({ defaultValues, onSubmit, onCancel, isEditing }: TravelPlanFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TravelPlanFormValues>({
    resolver: standardSchemaResolver(travelPlanSchema),
    defaultValues: {
      title: defaultValues?.title ?? "",
      destination: defaultValues?.destination ?? "",
      startDate: defaultValues?.startDate ?? "",
      endDate: defaultValues?.endDate ?? "",
      budget: defaultValues?.budget ?? 0,
      description: defaultValues?.description ?? "",
      status: defaultValues?.status ?? "계획중",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="title">여행 제목 *</Label>
        <Input id="title" placeholder="예: 도쿄 벚꽃 여행" {...register("title")} />
        {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
      </div>

      <div className="space-y-1">
        <Label htmlFor="destination">여행지 *</Label>
        <Input id="destination" placeholder="예: 일본 도쿄" {...register("destination")} />
        {errors.destination && <p className="text-xs text-red-500">{errors.destination.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label htmlFor="startDate">출발일 *</Label>
          <Input id="startDate" type="date" {...register("startDate")} />
          {errors.startDate && <p className="text-xs text-red-500">{errors.startDate.message}</p>}
        </div>
        <div className="space-y-1">
          <Label htmlFor="endDate">귀국일 *</Label>
          <Input id="endDate" type="date" {...register("endDate")} />
          {errors.endDate && <p className="text-xs text-red-500">{errors.endDate.message}</p>}
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="budget">예산 (원)</Label>
        <Input id="budget" type="number" placeholder="1000000" {...register("budget")} />
        {errors.budget && <p className="text-xs text-red-500">{errors.budget.message}</p>}
      </div>

      <div className="space-y-1">
        <Label htmlFor="status">상태</Label>
        <Select id="status" {...register("status")}>
          <option value="계획중">계획중</option>
          <option value="예약완료">예약완료</option>
          <option value="여행중">여행중</option>
          <option value="완료">완료</option>
        </Select>
      </div>

      <div className="space-y-1">
        <Label htmlFor="description">메모</Label>
        <Textarea id="description" placeholder="여행에 대한 메모를 입력하세요" {...register("description")} />
      </div>

      <div className="flex gap-2 justify-end pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>취소</Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "저장 중..." : isEditing ? "수정" : "생성"}
        </Button>
      </div>
    </form>
  );
}
