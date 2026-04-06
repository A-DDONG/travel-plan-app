import { create } from "zustand";
import { TravelPlan, TravelPlace, CreateTravelPlanInput, UpdateTravelPlanInput, CreateTravelPlaceInput, UpdateTravelPlaceInput } from "@/types";

interface TravelStore {
  plans: TravelPlan[];
  selectedPlan: TravelPlan | null;
  isLoading: boolean;

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

  fetchPlans: async () => {
    set({ isLoading: true });
    const res = await fetch("/api/travel-plans");
    const data: TravelPlan[] = await res.json();
    set({ plans: data, isLoading: false });
  },

  fetchPlan: async (id: string) => {
    set({ isLoading: true });
    const res = await fetch(`/api/travel-plans/${id}`);
    const data: TravelPlan = await res.json();
    set({ selectedPlan: data, isLoading: false });
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
    await get().updatePlace(planId, placeId, { isVisited });
  },
}));
