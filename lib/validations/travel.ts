import { z } from "zod";

export const travelPlanSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요"),
  destination: z.string().min(1, "여행지를 입력해주세요"),
  startDate: z.string().min(1, "출발일을 입력해주세요"),
  endDate: z.string().min(1, "귀국일을 입력해주세요"),
  budget: z.coerce.number().min(0, "예산은 0 이상이어야 합니다"),
  description: z.string(),
  status: z.enum(["계획중", "예약완료", "여행중", "완료"]),
});

export const travelPlaceSchema = z.object({
  name: z.string().min(1, "장소 이름을 입력해주세요"),
  category: z.enum(["식당", "관광지", "카페", "숙소", "쇼핑", "기타"]),
  address: z.string(),
  rating: z.coerce.number().min(0).max(5),
  memo: z.string(),
  visitDate: z.string().min(1, "방문 날짜를 입력해주세요"),
  isVisited: z.boolean(),
});

export type TravelPlanFormValues = z.infer<typeof travelPlanSchema>;
export type TravelPlaceFormValues = z.infer<typeof travelPlaceSchema>;
