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

export default function HomePage() {
  const { plans, fetchPlans, createPlan, updatePlan, deletePlan, isLoading } = useTravelStore();
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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold text-blue-600">
            <Plane className="h-5 w-5" />
            <span>여행 계획</span>
          </div>
          <Button size="sm" onClick={() => setShowCreate(true)}>
            <Plus className="h-4 w-4" />
            새 여행 만들기
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="text-center py-20 text-gray-400">불러오는 중...</div>
        ) : plans.length === 0 ? (
          <div className="text-center py-20 space-y-3">
            <Plane className="h-12 w-12 text-gray-300 mx-auto" />
            <p className="text-gray-400">아직 여행 계획이 없어요</p>
            <Button onClick={() => setShowCreate(true)}>첫 번째 여행 계획 만들기</Button>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">총 {plans.length}개의 여행 계획</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {plans.map((plan) => (
                <TravelPlanCard key={plan.id} plan={plan} onEdit={setEditingPlan} onDelete={handleDelete} />
              ))}
            </div>
          </>
        )}
      </main>

      <Dialog open={showCreate} onClose={() => setShowCreate(false)}>
        <DialogTitle>새 여행 계획</DialogTitle>
        <TravelPlanForm onSubmit={handleCreate} onCancel={() => setShowCreate(false)} />
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
