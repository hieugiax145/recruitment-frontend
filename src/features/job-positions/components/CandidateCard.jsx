import { Mail, Calendar } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Candidate Card Component (Base)
function CandidateCardBase({ candidate, onClick, isDragging = false }) {
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 p-2.5 mb-1.5 transition-all cursor-pointer group ${
        isDragging
          ? "opacity-50 shadow-lg"
          : "hover:shadow-md hover:border-gray-300"
      }`}
      onClick={onClick ? () => onClick(candidate) : undefined}
    >
      <div className="flex items-start gap-2.5">
        {/* Avatar */}
        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold text-xs shadow-sm">
          {getInitials(candidate.name)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Name */}
          <h4 className="font-semibold text-gray-900 text-sm truncate mb-1">
            {candidate.name}
          </h4>

          {/* Info - Compact */}
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-xs text-gray-600">
              <Mail className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{candidate.email}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Calendar className="h-3 w-3 flex-shrink-0" />
              <span>Nộp: {candidate.appliedDate}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Draggable Candidate Card
export default function CandidateCard({ candidate, onClick }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: candidate.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <CandidateCardBase
        candidate={candidate}
        onClick={onClick}
        isDragging={isDragging}
      />
    </div>
  );
}

// Export base component for DragOverlay
export { CandidateCardBase };
