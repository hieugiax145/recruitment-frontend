import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

// Candidate status columns configuration
const CANDIDATE_STATUSES = [
  {
    id: "APPLICATION_RECEIVED",
    label: "Tiếp nhận hồ sơ",
    color: "#3B82F6", // Blue
    bgColor: "#EFF6FF",
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
];

// Mock data - replace with API call
const MOCK_CANDIDATES = [
  {
    id: "1",
    name: "Nguyễn Văn A",
    email: "nguyenvana@gmail.com",
    phone: "0901234567",
    status: "APPLICATION_RECEIVED",
    appliedDate: "2025-10-20",
    avatar: null,
    position: "Senior Backend Developer",
    experience: "5 năm",
    education: "Đại học Bách Khoa",
  },
  {
    id: "2",
    name: "Trần Thị B",
    email: "tranthib@gmail.com",
    phone: "0912345678",
    status: "APPLICATION_RECEIVED",
    appliedDate: "2025-10-19",
    avatar: null,
    position: "Senior Backend Developer",
    experience: "6 năm",
    education: "Đại học Công nghệ",
  },
  {
    id: "3",
    name: "Lê Văn C",
    email: "levanc@gmail.com",
    phone: "0923456789",
    status: "INTERVIEW",
    appliedDate: "2025-10-18",
    avatar: null,
    position: "Senior Backend Developer",
    experience: "7 năm",
    education: "Đại học KHTN",
    interviewDate: "2025-10-25",
  },
  {
    id: "4",
    name: "Phạm Thị D",
    email: "phamthid@gmail.com",
    phone: "0934567890",
    status: "INTERVIEW",
    appliedDate: "2025-10-17",
    avatar: null,
    position: "Senior Backend Developer",
    experience: "5 năm",
    education: "Đại học Kinh tế",
    interviewDate: "2025-10-26",
  },
  {
    id: "5",
    name: "Hoàng Văn E",
    email: "hoangvane@gmail.com",
    phone: "0945678901",
    status: "OFFER",
    appliedDate: "2025-10-15",
    avatar: null,
    position: "Senior Backend Developer",
    experience: "8 năm",
    education: "Đại học Sư phạm",
    offerDate: "2025-10-22",
  },
  {
    id: "6",
    name: "Võ Thị F",
    email: "vothif@gmail.com",
    phone: "0956789012",
    status: "HIRED",
    appliedDate: "2025-10-10",
    avatar: null,
    position: "Senior Backend Developer",
    experience: "6 năm",
    education: "Đại học Ngoại thương",
    hiredDate: "2025-10-23",
  },
  {
    id: "7",
    name: "Đặng Văn G",
    email: "dangvang@gmail.com",
    phone: "0967890123",
    status: "REJECTED",
    appliedDate: "2025-10-08",
    avatar: null,
    position: "Senior Backend Developer",
    experience: "3 năm",
    education: "Đại học Luật",
    rejectedReason: "Không đủ kinh nghiệm",
  },
];

// Main Component
export default function JobPositionCandidates() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [candidates, setCandidates] = useState(MOCK_CANDIDATES);
  const [activeCandidate, setActiveCandidate] = useState(null);

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
    setSelectedCandidate(candidate);
  };

  const handleDragStart = (event) => {
    const { active } = event;
    const candidate = candidates.find((c) => c.id === active.id);
    setActiveCandidate(candidate);
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Find the candidate being dragged
    const activeCandidate = candidates.find((c) => c.id === activeId);
    if (!activeCandidate) return;

    // Determine the target status
    let targetStatus = null;

    // Check if dropping over a column
    if (CANDIDATE_STATUSES.find((s) => s.id === overId)) {
      targetStatus = overId;
    } else {
      // Dropping over another candidate - find its status
      const overCandidate = candidates.find((c) => c.id === overId);
      if (overCandidate) {
        targetStatus = overCandidate.status;
      }
    }

    // Update candidate status if changed and move to end of column
    if (targetStatus && activeCandidate.status !== targetStatus) {
      setCandidates((prev) => {
        // Remove the candidate from its current position
        const filtered = prev.filter((c) => c.id !== activeId);
        // Add it to the end with new status
        return [...filtered, { ...activeCandidate, status: targetStatus }];
      });
    }
  };

  const handleDragEnd = (event) => {
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
      toast.success(
        `Đã chuyển ${candidate.name} sang ${statusLabel || targetStatus}`
      );

      // Here you would call an API to update the candidate status
      // await updateCandidateStatus(candidate.id, targetStatus);
    }
  };

  return (
    <div className="h-full flex flex-col">
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
              Ứng viên - Senior Backend Developer
            </h2>
          </div>
        }
        actions={
          <Button onClick={() => navigate("/candidates")}>
            <User className="h-4 w-4 mr-2" />
            Thêm ứng viên
          </Button>
        }
      />

      {/* Kanban Board with Drag & Drop */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex-1 mt-4 overflow-x-auto overflow-y-hidden px-1 min-h-0">
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

      {/* Candidate Detail Modal */}
      {selectedCandidate && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
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
