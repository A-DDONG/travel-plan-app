export type TravelStatus = "계획중" | "예약완료" | "여행중" | "완료";
export type PlaceCategory = "식당" | "관광지" | "카페" | "숙소" | "쇼핑" | "기타";

export interface TravelPlan {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  description: string;
  status: TravelStatus;
  places: TravelPlace[];
  createdAt: string;
  updatedAt: string;
}

export interface TravelPlace {
  id: string;
  travelPlanId: string;
  name: string;
  category: PlaceCategory;
  address: string;
  rating: number;
  memo: string;
  visitDate: string;
  isVisited: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CreateTravelPlanInput = Omit<TravelPlan, "id" | "places" | "createdAt" | "updatedAt">;
export type UpdateTravelPlanInput = Partial<CreateTravelPlanInput>;
export type CreateTravelPlaceInput = Omit<TravelPlace, "id" | "travelPlanId" | "createdAt" | "updatedAt">;
export type UpdateTravelPlaceInput = Partial<CreateTravelPlaceInput>;
