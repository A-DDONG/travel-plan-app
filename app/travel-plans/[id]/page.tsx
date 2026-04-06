"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTravelStore } from "@/lib/stores/travel";
import { TravelPlace } from "@/types";
import { TravelPlaceCard } from "@/components/travel-place/TravelPlaceCard";
import { TravelPlaceForm } from "@/components/travel-place/TravelPlaceForm";
import { Dialog, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TravelPlaceFormValues } from "@/lib/validations/travel";
import { ArrowLeft, Plus, MapPin, Calendar, Wallet, StickyNote } from "lucide-react";
import { PlaceCategory, TravelStatus } from "@/types";

const statusVariant: Record<TravelStatus, "default" | "warning" | "success" | "secondary"> = {
  계획중: "default",
  예약완료: "warning",
  여행중: "success",
  완료: "secondary",
};

const CATEGORIES: (PlaceCategory | "전체")[] = ["전체", "관광지", "식당", "카페", "숙소", "쇼핑", "기타"];

export default function TravelPlanDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { selectedPlan, fetchPlan, createPlace, updatePlace, deletePlace, toggleVisited, isLoading } = useTravelStore();
  const [showAddPlace, setShowAddPlace] = useState(false);
  const [editingPlace, setEditingPlace] = useState<TravelPlace | null>(null);
  const [filterCategory, setFilterCategory] = useState<PlaceCategory | "전체">("전체");

  useEffect(() => {
    fetchPlan(id);
  }, [id, fetchPlan]);

  const handleAddPlace = async (data: TravelPlaceFormValues) => {
    await createPlace(id, data);
    setShowAddPlace(false);
  };

  const handleUpdatePlace = async (data: TravelPlaceFormValues) => {
    if (!editingPlace) return;
    await updatePlace(id, editingPlace.id, data);
    setEditingPlace(null);
  };

  const handleDeletePlace = async (placeId: string) => {
    if (!confirm("장소를 삭제하시겠습니까?")) return;
    await deletePlace(id, placeId);
  };

  const handleToggleVisited = async (placeId: string, isVisited: boolean) => {
    await toggleVisited(id, placeId, isVisited);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen text-gray-400">불러오는 중...</div>;
  }

  if (!selectedPlan) {
    return <div className="flex items-center justify-center min-h-screen text-gray-400">여행 계획을 찾을 수 없습니다.</div>;
  }

  const places = selectedPlan.places ?? [];
  const filteredPlaces = filterCategory === "전체"
    ? places
    : places.filter((p) => p.category === filterCategory);

  const visitedCount = places.filter((p) => p.isVisited).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center gap-3">
          <button onClick={() => router.push("/")} className="text-gray-500 hover:text-gray-700">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="font-semibold text-gray-800 truncate flex-1">{selectedPlan.title}</h1>
          <Badge variant={statusVariant[selectedPlan.status]}>{selectedPlan.status}</Badge>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Plan Info Card */}
        <div className="bg-white rounded-xl border p-5 space-y-3">
          <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-blue-500 shrink-0" />
              <span>{selectedPlan.destination}</span>
            </div>
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-blue-500 shrink-0" />
              <span>{selectedPlan.budget.toLocaleString()}원</span>
            </div>
            <div className="flex items-center gap-2 col-span-2">
              <Calendar className="h-4 w-4 text-blue-500 shrink-0" />
              <span>{selectedPlan.startDate} ~ {selectedPlan.endDate}</span>
            </div>
            {selectedPlan.description && (
              <div className="flex items-start gap-2 col-span-2">
                <StickyNote className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                <span className="text-gray-500">{selectedPlan.description}</span>
              </div>
            )}
          </div>
        </div>

        {/* Places Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="font-semibold text-gray-800">방문 장소</h2>
              {places.length > 0 && (
                <p className="text-xs text-gray-400 mt-0.5">
                  {places.length}개 장소 · {visitedCount}개 방문 완료
                </p>
              )}
            </div>
            <Button size="sm" onClick={() => setShowAddPlace(true)}>
              <Plus className="h-4 w-4" />
              장소 추가
            </Button>
          </div>

          {/* Category Filter */}
          {places.length > 0 && (
            <div className="flex gap-2 flex-wrap mb-4">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    filterCategory === cat
                      ? "bg-blue-600 text-white"
                      : "bg-white border text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Places List */}
          {filteredPlaces.length === 0 ? (
            <div className="text-center py-10 text-gray-400 text-sm">
              {places.length === 0 ? "아직 장소가 없어요. 장소를 추가해보세요!" : "해당 카테고리의 장소가 없어요."}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredPlaces.map((place) => (
                <TravelPlaceCard
                  key={place.id}
                  place={place}
                  onEdit={setEditingPlace}
                  onDelete={handleDeletePlace}
                  onToggleVisited={handleToggleVisited}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Add Place Dialog */}
      <Dialog open={showAddPlace} onClose={() => setShowAddPlace(false)}>
        <DialogTitle>장소 추가</DialogTitle>
        <TravelPlaceForm onSubmit={handleAddPlace} onCancel={() => setShowAddPlace(false)} />
      </Dialog>

      {/* Edit Place Dialog */}
      <Dialog open={!!editingPlace} onClose={() => setEditingPlace(null)}>
        <DialogTitle>장소 수정</DialogTitle>
        {editingPlace && (
          <TravelPlaceForm
            defaultValues={editingPlace}
            onSubmit={handleUpdatePlace}
            onCancel={() => setEditingPlace(null)}
            isEditing
          />
        )}
      </Dialog>
    </div>
  );
}
