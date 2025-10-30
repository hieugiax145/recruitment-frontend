import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useCandidate } from "./hooks/useCandidates";
import ContentHeader from "../../components/ui/ContentHeader";
import Button from "../../components/ui/Button";
import CandidateInfoCard from "./components/CandidateInfoCard";
import JobPositionInfoCard from "./components/JobPositionInfoCard";
import UpcomingScheduleCard from "./components/UpcomingScheduleCard";
import FeedbackCard from "./components/FeedbackCard";
import ApplicationProgress from "./components/ApplicationProgress";
import ResumeViewer from "./components/ResumeViewer";
import { useTranslation } from "react-i18next";

export default function CandidateDetail() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Get candidate from navigation state (passed from list)
  const candidateFromState = location.state?.candidate;

  // Fetch candidate detail from API (fallback if no state or when refresh)
  const { data, isLoading, isError, error } = useCandidate(id, {
    enabled: !candidateFromState, // Only fetch if no state
  });

  // Use state candidate if available, otherwise use API data
  const candidate = candidateFromState || data?.data;

  // Show loading only if fetching from API (not from state)
  if (!candidateFromState && isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Đang tải...</div>
      </div>
    );
  }

  // Show error only if API call failed (not from state)
  if (!candidateFromState && isError) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <div className="text-red-500">Lỗi: {error?.message}</div>
        <Button onClick={() => navigate("/candidates")}>Quay lại</Button>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <div className="text-gray-500">Không tìm thấy ứng viên</div>
        <Button onClick={() => navigate("/candidates")}>Quay lại</Button>
      </div>
    );
  }

  // Map fields for backward compatibility
  const displayName = candidate.fullName || candidate.candidateName || "-";
  const displayEmail = candidate.email || candidate.candidateEmail || "-";
  const displayPhone = candidate.phone || candidate.candidatePhone || "-";

  return (
    <div className="flex flex-col h-full">
      <ContentHeader
        title={t("candidateDetail")}
        subtitle={displayName}
        onBack={() => navigate("/candidates")}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/candidates")}>
              {t("close")}
            </Button>
            <Button>{t("updateStatus")}</Button>
          </div>
        }
      />

      {/* Two Column Layout */}
      <div className="flex-1 mt-4 overflow-auto">
        <div className="grid grid-cols-12 gap-4">
          {/* Left Column - Narrower (4 cols) */}
          <div className="col-span-4 space-y-4">
            <CandidateInfoCard
              displayName={displayName}
              displayEmail={displayEmail}
              displayPhone={displayPhone}
              appliedDate={candidate.appliedDate}
            />

            <JobPositionInfoCard
              jobPositionTitle={candidate.jobPositionTitle}
              departmentName={candidate.departmentName}
            />

            <UpcomingScheduleCard />

            <FeedbackCard
              feedback={candidate.feedback}
              notes={candidate.notes}
              rejectionReason={candidate.rejectionReason}
            />
          </div>

          {/* Right Column - Wider (8 cols) */}
          <div className="col-span-8 space-y-4">
            <ApplicationProgress status={candidate.status} />

            <ResumeViewer resumeUrl={candidate.resumeUrl} />
          </div>
        </div>
      </div>
    </div>
  );
}
