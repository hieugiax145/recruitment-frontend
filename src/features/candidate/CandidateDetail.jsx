import { useParams, useNavigate } from "react-router-dom";
import { useCandidate, useAddCandidateComment } from "./hooks/useCandidates";
import ContentHeader from "../../components/ui/ContentHeader";
import Button from "../../components/ui/Button";
import CandidateInfoCard from "./components/CandidateInfoCard";
import JobPositionInfoCard from "./components/JobPositionInfoCard";
import UpcomingScheduleCard from "./components/UpcomingScheduleCard";
import FeedbackCard from "./components/FeedbackCard";
import NotesCard from "./components/NotesCard";
import ApplicationProgress from "./components/ApplicationProgress";
import ResumeViewer from "./components/ResumeViewer";
import { useTranslation } from "react-i18next";
import { Calendar, Mail } from "lucide-react";
import LoadingContent from "../../components/ui/LoadingContent";
import { useState } from "react";
import SendEmailModal from "./components/SendEmailModal";
import CreateEventModal from "../calendar/components/CreateEventModal";

export default function CandidateDetail() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  // Always fetch candidate detail by ID
  const { data, isLoading, isError, error } = useCandidate(id);
  const addComment = useAddCandidateComment();

  const candidate = data?.data;

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <ContentHeader
          title={t("candidateDetail")}
          subtitle="..."
          onBack={() => navigate("/candidates")}
          actions={
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate("/candidates")}>
                {t("close")}
              </Button>
            </div>
          }
        />
        <div className="flex-1 flex items-center justify-center mt-4">
          <LoadingContent />
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
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
  const jobPositionTitle = candidate.jobPosition?.title || "-";
  const departmentName = candidate.jobPosition?.departmentName || "-";
  const salaryMin = candidate.jobPosition?.salaryMin;
  const salaryMax = candidate.jobPosition?.salaryMax;
  const currency = candidate.jobPosition?.currency;
  const experienceLevel = candidate.jobPosition?.experienceLevel;
  const yearsOfExperience = candidate.jobPosition?.yearsOfExperience;

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
            <Button
              variant="outline"
              onClick={() => setShowEmailModal(true)}
            >
              <Mail className="h-4 w-4 mr-2" />
              Gửi email
            </Button>
            <Button onClick={() => setShowCreateEventModal(true)}>
              <Calendar className="h-4 w-4 mr-2" />
              Tạo lịch
            </Button>
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
              jobPositionTitle={jobPositionTitle}
              departmentName={departmentName}
              salaryMin={salaryMin}
              salaryMax={salaryMax}
              currency={currency}
              experienceLevel={experienceLevel}
              yearsOfExperience={yearsOfExperience}
            />

            <UpcomingScheduleCard schedules={candidate.upcomingSchedules} />

            <NotesCard notes={candidate.notes} />

            <FeedbackCard
              feedback={candidate.feedback}
              rejectionReason={candidate.rejectionReason}
              comments={candidate.comments}
              onAddComment={(content) =>
                addComment.mutate({ applicationId: candidate.id, content })
              }
            />
          </div>

          {/* Right Column - Wider (8 cols) */}
          <div className="col-span-8 space-y-4">
            <ApplicationProgress status={candidate.status} />

            <ResumeViewer resumeUrl={candidate.resumeUrl} />
          </div>
        </div>
      </div>

      {/* Email Modal */}
      <SendEmailModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        recipientEmail={displayEmail}
        recipientName={displayName}
      />

      {/* Create Event Modal */}
      <CreateEventModal
        isOpen={showCreateEventModal}
        onClose={() => setShowCreateEventModal(false)}
        defaultCandidate={{
          id: candidate.id,
          name: displayName,
          departmentId: candidate.jobPosition?.departmentId,
        }}
      />
    </div>
  );
}
