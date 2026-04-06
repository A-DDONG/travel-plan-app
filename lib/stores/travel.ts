import { create } from "zustand";
import { TravelPlan, TravelPlace, CreateTravelPlanInput, UpdateTravelPlanInput, CreateTravelPlaceInput, UpdateTravelPlaceInput } from "@/types";

function replacePlaceInPlans(plans: TravelPlan[], planId: string, placeId: string, updater: (place: TravelPlace) => TravelPlace) {
  return plans.map((plan) =>
    plan.id === planId
      ? {
          ...plan,
          places: plan.places.map((place) => (place.id === placeId ? updater(place) : place)),
        }
      : plan,
  );
}

function replacePlaceInSelectedPlan(
  selectedPlan: TravelPlan | null,
  planId: string,
  placeId: string,
  updater: (place: TravelPlace) => TravelPlace,
) {
  if (!selectedPlan || selectedPlan.id !== planId) {
    return selectedPlan;
  }

  return {
    ...selectedPlan,
    places: selectedPlan.places.map((place) => (place.id === placeId ? updater(place) : place)),
  };
}

interface TravelStore {
  plans: TravelPlan[];
  selectedPlan: TravelPlan | null;
  isLoading: boolean;
  hasFetchedPlans: boolean;
  hasFetchedSelectedPlan: boolean;

  // Travel Plan actions
  fetchPlans: () => Promise<void>;
  fetchPlan: (id: string) => Promise<void>;
  createPlan: (data: CreateTravelPlanInput) => Promise<void>;
  updatePlan: (id: string, data: UpdateTravelPlanInput) => Promise<void>;
  deletePlan: (id: string) => Promise<void>;
  setSelectedPlan: (plan: TravelPlan | null) => void;

  // Travel Place actions
  createPlace: (planId: string, data: CreateTravelPlaceInput) => Promise<void>;
  updatePlace: (planId: string, placeId: string, data: UpdateTravelPlaceInput) => Promise<void>;
  deletePlace: (planId: string, placeId: string) => Promise<void>;
  toggleVisited: (planId: string, placeId: string, isVisited: boolean) => Promise<void>;
}

export const useTravelStore = create<TravelStore>((set, get) => ({
  plans: [],
  selectedPlan: null,
  isLoading: false,
  hasFetchedPlans: false,
  hasFetchedSelectedPlan: false,

  fetchPlans: async () => {
    set({ isLoading: true });

    try {
      const res = await fetch("/api/travel-plans");

      if (!res.ok) {
        throw new Error("여행 계획을 불러오지 못했습니다.");
      }

      const data: TravelPlan[] = await res.json();
      set({ plans: data, isLoading: false, hasFetchedPlans: true });
    } catch {
      set({ plans: [], isLoading: false, hasFetchedPlans: true });
    }
  },

  fetchPlan: async (id: string) => {
    set({ isLoading: true, selectedPlan: null, hasFetchedSelectedPlan: false });

    try {
      const res = await fetch(`/api/travel-plans/${id}`);

      if (!res.ok) {
        throw new Error("여행 계획을 찾을 수 없습니다.");
      }

      const data: TravelPlan = await res.json();
      set({ selectedPlan: data, isLoading: false, hasFetchedSelectedPlan: true });
    } catch {
      set({ selectedPlan: null, isLoading: false, hasFetchedSelectedPlan: true });
    }
  },

  createPlan: async (data: CreateTravelPlanInput) => {
    const res = await fetch("/api/travel-plans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const newPlan: TravelPlan = await res.json();
    set((state) => ({ plans: [newPlan, ...state.plans] }));
  },

  updatePlan: async (id: string, data: UpdateTravelPlanInput) => {
    const res = await fetch(`/api/travel-plans/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const updated: TravelPlan = await res.json();
    set((state) => ({
      plans: state.plans.map((p) => (p.id === id ? updated : p)),
      selectedPlan: state.selectedPlan?.id === id ? updated : state.selectedPlan,
    }));
  },

  deletePlan: async (id: string) => {
    await fetch(`/api/travel-plans/${id}`, { method: "DELETE" });
    set((state) => ({
      plans: state.plans.filter((p) => p.id !== id),
      selectedPlan: state.selectedPlan?.id === id ? null : state.selectedPlan,
    }));
  },

  setSelectedPlan: (plan: TravelPlan | null) => set({ selectedPlan: plan }),

  createPlace: async (planId: string, data: CreateTravelPlaceInput) => {
    const res = await fetch(`/api/travel-plans/${planId}/places`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const newPlace: TravelPlace = await res.json();
    set((state) => ({
      selectedPlan: state.selectedPlan
        ? { ...state.selectedPlan, places: [...state.selectedPlan.places, newPlace] }
        : null,
    }));
  },

  updatePlace: async (planId: string, placeId: string, data: UpdateTravelPlaceInput) => {
    const res = await fetch(`/api/travel-plans/${planId}/places/${placeId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const updated: TravelPlace = await res.json();
    set((state) => ({
      selectedPlan: state.selectedPlan
        ? {
            ...state.selectedPlan,
            places: state.selectedPlan.places.map((pl) => (pl.id === placeId ? updated : pl)),
          }
        : null,
    }));
  },

  deletePlace: async (planId: string, placeId: string) => {
    await fetch(`/api/travel-plans/${planId}/places/${placeId}`, { method: "DELETE" });
    set((state) => ({
      selectedPlan: state.selectedPlan
        ? { ...state.selectedPlan, places: state.selectedPlan.places.filter((pl) => pl.id !== placeId) }
        : null,
    }));
  },

  toggleVisited: async (planId: string, placeId: string, isVisited: boolean) => {
    const previousPlans = get().plans;
    const previousSelectedPlan = get().selectedPlan;

    set((state) => ({
      plans: replacePlaceInPlans(state.plans, planId, placeId, (place) => ({ ...place, isVisited })),
      selectedPlan: replacePlaceInSelectedPlan(state.selectedPlan, planId, placeId, (place) => ({ ...place, isVisited })),
    }));

    try {
      const res = await fetch(`/api/travel-plans/${planId}/places/${placeId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isVisited }),
      });

      if (!res.ok) {
        throw new Error("방문 상태를 변경하지 못했습니다.");
      }

      const updated: TravelPlace = await res.json();

      set((state) => ({
        plans: replacePlaceInPlans(state.plans, planId, placeId, () => updated),
        selectedPlan: replacePlaceInSelectedPlan(state.selectedPlan, planId, placeId, () => updated),
      }));
    } catch {
      set({ plans: previousPlans, selectedPlan: previousSelectedPlan });
    }
  },
}));
