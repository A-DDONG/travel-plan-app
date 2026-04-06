"use client";

import { TravelPlace, PlaceCategory } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Calendar,
  Star,
  Pencil,
  Trash2,
  CheckCircle2,
  Circle,
} from "lucide-react";

const categoryColors: Record<PlaceCategory, string> = {
  식당: "bg-orange-100 text-orange-700",
  관광지: "bg-blue-100 text-blue-700",
  카페: "bg-amber-100 text-amber-700",
  숙소: "bg-purple-100 text-purple-700",
  쇼핑: "bg-pink-100 text-pink-700",
  기타: "bg-gray-100 text-gray-700",
};

interface TravelPlaceCardProps {
  place: TravelPlace;
  onEdit: (place: TravelPlace) => void;
  onDelete: (id: string) => void;
  onToggleVisited: (id: string, isVisited: boolean) => void;
}

export function TravelPlaceCard({
  place,
  onEdit,
  onDelete,
  onToggleVisited,
}: TravelPlaceCardProps) {
  return (
    <Card className={`transition-all ${place.isVisited ? "opacity-60" : ""}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <button
            onClick={() => onToggleVisited(place.id, !place.isVisited)}
            className="mt-0.5 shrink-0 text-gray-400 transition-all duration-150 active:scale-90 hover:text-green-500"
            aria-label={place.isVisited ? "방문 완료 해제" : "방문 완료 체크"}
          >
            {place.isVisited ? (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            ) : (
              <Circle className="h-5 w-5" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-gray-900">
                {place.name}
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryColors[place.category]}`}
              >
                {place.category}
              </span>
              {place.isVisited && <Badge variant="success">방문 완료</Badge>}
            </div>

            <div className="mt-1.5 space-y-1 text-xs text-gray-600">
              {place.address && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate">{place.address}</span>
                </div>
              )}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{place.visitDate}</span>
                </div>
                {place.rating > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                    <span>{place.rating}</span>
                  </div>
                )}
              </div>
              {place.memo && (
                <p className="truncate text-gray-500">{place.memo}</p>
              )}
            </div>
          </div>

          <div className="flex gap-1 shrink-0">
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7"
              onClick={() => onEdit(place)}
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 text-red-400 hover:text-red-600"
              onClick={() => onDelete(place.id)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
