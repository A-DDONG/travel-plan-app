"use client";

import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import {
  travelPlaceSchema,
  TravelPlaceFormValues,
} from "@/lib/validations/travel";
import { TravelPlace } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";

interface TravelPlaceFormProps {
  defaultValues?: Partial<TravelPlace>;
  onSubmit: (data: TravelPlaceFormValues) => Promise<void>;
  onCancel: () => void;
  isEditing?: boolean;
}

export function TravelPlaceForm({
  defaultValues,
  onSubmit,
  onCancel,
  isEditing,
}: TravelPlaceFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TravelPlaceFormValues>({
    resolver: standardSchemaResolver(travelPlaceSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      category: defaultValues?.category ?? "관광지",
      address: defaultValues?.address ?? "",
      rating: defaultValues?.rating ?? 0,
      memo: defaultValues?.memo ?? "",
      visitDate: defaultValues?.visitDate ?? "",
      isVisited: defaultValues?.isVisited ?? false,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-gray-900">
      <div className="space-y-1">
        <Label htmlFor="name">장소 이름 *</Label>
        <Input id="name" placeholder="예: 우에노 공원" {...register("name")} />
        {errors.name && (
          <p className="text-xs text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label htmlFor="category">카테고리 *</Label>
          <Select id="category" {...register("category")}>
            <option value="관광지">관광지</option>
            <option value="식당">식당</option>
            <option value="카페">카페</option>
            <option value="숙소">숙소</option>
            <option value="쇼핑">쇼핑</option>
            <option value="기타">기타</option>
          </Select>
        </div>
        <div className="space-y-1">
          <Label htmlFor="rating">평점 (0~5)</Label>
          <Input
            id="rating"
            type="number"
            min={0}
            max={5}
            step={0.5}
            {...register("rating")}
          />
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="address">주소</Label>
        <Input
          id="address"
          placeholder="예: 도쿄도 다이토구"
          {...register("address")}
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="visitDate">방문 날짜 *</Label>
        <Input id="visitDate" type="date" {...register("visitDate")} />
        {errors.visitDate && (
          <p className="text-xs text-red-500">{errors.visitDate.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="memo">메모</Label>
        <Textarea
          id="memo"
          placeholder="장소에 대한 메모를 입력하세요"
          {...register("memo")}
        />
      </div>

      <div className="flex items-center gap-2 text-gray-800">
        <input
          id="isVisited"
          type="checkbox"
          className="h-4 w-4 accent-blue-600"
          {...register("isVisited")}
        />
        <Label htmlFor="isVisited">방문 완료</Label>
      </div>

      <div className="flex gap-2 justify-end pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          취소
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "저장 중..." : isEditing ? "수정" : "추가"}
        </Button>
      </div>
    </form>
  );
}
