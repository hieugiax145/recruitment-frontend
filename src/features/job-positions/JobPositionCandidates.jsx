import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import ContentHeader from "../../components/ui/ContentHeader";
import { ArrowLeft, User, Mail, Calendar, FileText, Phone } from "lucide-react";
import Button from "../../components/ui/Button";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { toast } from "react-toastify";
import CandidateCard, { CandidateCardBase } from "./components/CandidateCard";
import CandidateColumn from "./components/CandidateColumn";
import {
  useCandidates,
  useChangeStageCandidate,
  candidateKeys,
} from "../candidate/hooks/useCandidates";
import { useJobPosition } from "./hooks/useJobPositions";
import LoadingOverlay from "../../components/ui/LoadingOverlay";
import AddCandidateModal from "../candidate/components/AddCandidateModal";
import LoadingContent from "../../components/ui/LoadingContent";

// Candidate status columns configuration
const CANDIDATE_STATUSES = [
  {
    id: "NEW",
    label: "Mới",
    color: "#3B82F6", // Blue
    bgColor: "#EFF6FF",
  },
  {
    id: "REVIEWING",
    label: "Đang xem xét",
    color: "#6366F1", // Indigo
    bgColor: "#EEF2FF",
  },
  {
    id: "INTERVIEW",
    label: "Phỏng vấn",
    color: "#F59E0B", // Amber
    bgColor: "#FEF3C7",
  },
  {
    id: "OFFER",
    label: "Offer",
    color: "#8B5CF6", // Purple
    bgColor: "#F5F3FF",
  },
  {
    id: "HIRED",
    label: "Tuyển",
    color: "#10B981", // Green
    bgColor: "#D1FAE5",
  },
  {
    id: "REJECTED",
    label: "Từ chối",
    color: "#EF4444", // Red
    bgColor: "#FEE2E2",
  },
  {
    id: "ARCHIVED",
    label: "Lưu trữ",
    color: "#6B7280", // Gray
    bgColor: "#F3F4F6",
  },
];

// Main Component
export default function JobPositionCandidates() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [activeCandidate, setActiveCandidate] = useState(null);
  const [showAddCandidateModal, setShowAddCandidateModal] = useState(false);

  // Fetch job position data
  const { data: jobPosition } = useJobPosition(id);

  // Fetch candidates for this job position
  const {
    data: candidatesData,
    isLoading,
    error,
  } = useCandidates({
    jobPositionId: id,
  });
  const changeStageMutation = useChangeStageCandidate();

  // Normalize candidates data - handle both 'name' and 'fullName' fields
  const normalizeCandidate = (candidate) => ({
    ...candidate,
    name: candidate.name || candidate.fullName || "",
  });

  // Extract candidates array from response - handle nested structure
  const candidatesArray = Array.isArray(candidatesData?.data?.result)
    ? candidatesData.data.result
    : Array.isArray(candidatesData?.result)
    ? candidatesData.result
    : Array.isArray(candidatesData)
    ? candidatesData
    : [];

  // Normalize all candidates
  const candidates = candidatesArray.map(normalizeCandidate);

  // Configure drag sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required to start drag
      },
    })
  );

  // Group candidates by status
  const candidatesByStatus = CANDIDATE_STATUSES.reduce((acc, status) => {
    acc[status.id] = candidates.filter((c) => c.status === status.id);
    return acc;
  }, {});

  const handleCandidateClick = (candidate) => {
    // Normalize candidate data before setting it
    setSelectedCandidate(normalizeCandidate(candidate));
  };

  const handleDragStart = (event) => {
    const { active } = event;
    const candidate = candidates.find((c) => c.id === active.id);
    setActiveCandidate(candidate);
  };

  const handleDragOver = (event) => {
    // This handler is kept for visual feedback during drag
    // The actual status update happens in handleDragEnd
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveCandidate(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Find the candidate
    const candidate = candidates.find((c) => c.id === activeId);
    if (!candidate) return;

    // Determine target status
    let targetStatus = null;
    if (CANDIDATE_STATUSES.find((s) => s.id === overId)) {
      targetStatus = overId;
    } else {
      const overCandidate = candidates.find((c) => c.id === overId);
      if (overCandidate) {
        targetStatus = overCandidate.status;
      }
    }

    if (targetStatus && candidate.status !== targetStatus) {
      // Get status label for toast
      const statusLabel = CANDIDATE_STATUSES.find(
        (s) => s.id === targetStatus
      )?.label;

      // Change candidate stage via API
      try {
        await changeStageMutation.mutateAsync({
          id: candidate.id,
          stage: targetStatus,
        });
        toast.success(
          `Đã chuyển ${candidate.name} sang ${statusLabel || targetStatus}`
        );
      } catch (error) {
        // Error is already handled by the mutation's onError
        console.error("Failed to change candidate stage:", error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex flex-col relative">
        <ContentHeader
          title={
            <div className="flex items-center gap-3">
              <div
                onClick={() => navigate("/job-positions")}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Ứng viên - {jobPosition?.title || "..."}
              </h2>
            </div>
          }
          actions={
            <Button onClick={() => setShowAddCandidateModal(true)}>
              <User className="h-4 w-4 mr-2" />
              Thêm ứng viên
            </Button>
          }
        />
        <div className="flex-1 flex items-center justify-center">
          <LoadingContent />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col relative">
      {/* Header */}
      <ContentHeader
        title={
          <div className="flex items-center gap-3">
            <div
              onClick={() => navigate("/job-positions")}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Ứng viên - {jobPosition?.title}
            </h2>
          </div>
        }
        actions={
          <Button onClick={() => setShowAddCandidateModal(true)}>
            <User className="h-4 w-4 mr-2" />
            Thêm ứng viên
          </Button>
        }
      />

      {/* Error State */}
      {error && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-red-500">
            Có lỗi xảy ra khi tải dữ liệu: {error.message || "Unknown error"}
          </div>
        </div>
      )}

      {/* Kanban Board with Drag & Drop */}
      {!error && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex-1 mt-4 overflow-x-auto overflow-y-hidden px-1 min-h-0 relative">
            <div className="flex gap-3 min-w-max h-full">
              <SortableContext items={CANDIDATE_STATUSES.map((s) => s.id)}>
                {CANDIDATE_STATUSES.map((status) => (
                  <CandidateColumn
                    key={status.id}
                    status={status}
                    candidates={candidatesByStatus[status.id] || []}
                    onCandidateClick={handleCandidateClick}
                  />
                ))}
              </SortableContext>
            </div>
            {/* Loading Overlay */}
            {/* <LoadingOverlay show={isLoading} /> */}
          </div>

          {/* Drag Overlay */}
          <DragOverlay>
            {activeCandidate ? (
              <div className="rotate-3 scale-105">
                <CandidateCardBase candidate={activeCandidate} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

      {/* Candidate Detail Modal */}
      {selectedCandidate && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
          onClick={() => setSelectedCandidate(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 pb-4 border-b border-gray-100">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  {selectedCandidate.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    {selectedCandidate.name}
                  </h3>
                  <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                    {selectedCandidate.experience} kinh nghiệm
                  </span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Email</p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedCandidate.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">
                      Số điện thoại
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedCandidate.phone}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <FileText className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Học vấn</p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedCandidate.education}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">
                      Ngày nộp hồ sơ
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedCandidate.appliedDate}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 pt-4 border-t border-gray-100 flex gap-3">
              <Button
                variant="outline"
                onClick={() => setSelectedCandidate(null)}
                className="flex-1"
              >
                Đóng
              </Button>
              <Button className="flex-1">Xem chi tiết</Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Candidate Modal */}
      <AddCandidateModal
        isOpen={showAddCandidateModal}
        onClose={() => setShowAddCandidateModal(false)}
        jobPosition={jobPosition || null}
        onSuccess={() => {
          // Refresh candidates list after successful addition
          queryClient.invalidateQueries({
            queryKey: candidateKeys.list({ jobPositionId: id }),
          });
        }}
      />

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f8f9fa;
          border-radius: 4px;
          margin: 4px 0;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
          border: 2px solid #f8f9fa;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
}
