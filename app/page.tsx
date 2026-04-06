"use client";

import { useEffect, useState } from "react";
import { useTravelStore } from "@/lib/stores/travel";
import { TravelPlan } from "@/types";
import { TravelPlanCard } from "@/components/travel-plan/TravelPlanCard";
import { TravelPlanForm } from "@/components/travel-plan/TravelPlanForm";
import { Dialog, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TravelPlanFormValues } from "@/lib/validations/travel";
import { Plus, Plane } from "lucide-react";

function TravelPlanCardSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm animate-pulse">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-3 flex-1">
          <div className="h-4 w-32 rounded bg-gray-200" />
          <div className="h-3 w-24 rounded bg-gray-100" />
        </div>
        <div className="h-6 w-16 rounded-full bg-gray-100" />
      </div>

      <div className="mt-5 space-y-3">
        <div className="h-3 w-40 rounded bg-gray-100" />
        <div className="h-3 w-44 rounded bg-gray-100" />
        <div className="h-3 w-28 rounded bg-gray-100" />
      </div>

      <div className="mt-5 flex justify-end gap-2">
        <div className="h-8 w-16 rounded-md bg-gray-100" />
        <div className="h-8 w-16 rounded-md bg-gray-100" />
      </div>
    </div>
  );
}

export default function HomePage() {
  const {
    plans,
    fetchPlans,
    createPlan,
    updatePlan,
    deletePlan,
    isLoading,
    hasFetchedPlans,
  } = useTravelStore();
  const [showCreate, setShowCreate] = useState(false);
  const [editingPlan, setEditingPlan] = useState<TravelPlan | null>(null);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const handleCreate = async (data: TravelPlanFormValues) => {
    await createPlan(data);
    setShowCreate(false);
  };

  const handleUpdate = async (data: TravelPlanFormValues) => {
    if (!editingPlan) return;
    await updatePlan(editingPlan.id, data);
    setEditingPlan(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    await deletePlan(id);
  };

  const isInitialLoading = !hasFetchedPlans;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold text-blue-600">
            <Plane className="h-5 w-5" />
            <span>여행 계획</span>
          </div>
          <Button size="sm" onClick={() => setShowCreate(true)}>
            <Plus className="h-4 w-4" />새 여행 만들기
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {isInitialLoading ? (
          <div className="space-y-4" aria-live="polite" aria-busy="true">
            <div className="space-y-2 py-2">
              <div className="h-4 w-36 rounded bg-gray-200 animate-pulse" />
              <div className="h-3 w-56 rounded bg-gray-100 animate-pulse" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <TravelPlanCardSkeleton key={index} />
              ))}
            </div>
          </div>
        ) : plans.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
              <Plane className="h-7 w-7 text-blue-400" />
            </div>
            <div className="space-y-1">
              <p className="text-base font-medium text-gray-700">
                아직 등록된 여행 계획이 없어요
              </p>
              <p className="text-sm text-gray-400">
                첫 일정을 만들어두면 여행 준비를 한눈에 관리할 수 있어요.
              </p>
            </div>
            <Button onClick={() => setShowCreate(true)}>
              첫 번째 여행 계획 만들기
            </Button>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">
              총 {plans.length}개의 여행 계획
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {plans.map((plan) => (
                <TravelPlanCard
                  key={plan.id}
                  plan={plan}
                  onEdit={setEditingPlan}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </>
        )}
      </main>

      <Dialog open={showCreate} onClose={() => setShowCreate(false)}>
        <DialogTitle>새 여행 계획</DialogTitle>
        <TravelPlanForm
          onSubmit={handleCreate}
          onCancel={() => setShowCreate(false)}
        />
      </Dialog>

      <Dialog open={!!editingPlan} onClose={() => setEditingPlan(null)}>
        <DialogTitle>여행 계획 수정</DialogTitle>
        {editingPlan && (
          <TravelPlanForm
            defaultValues={editingPlan}
            onSubmit={handleUpdate}
            onCancel={() => setEditingPlan(null)}
            isEditing
          />
        )}
      </Dialog>
    </div>
  );
}
