import { ChevronRight, X, AlertTriangle } from "lucide-react";
import Button from "../../components/ui/Button";
import ContentHeader from "../../components/ui/ContentHeader";
import TextInput from "../../components/ui/TextInput";
import CheckBoxOptions from "../../components/ui/CheckBoxOptions";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SelectDropdown from "../../components/ui/SelectDropdown";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import Modal from "../../components/ui/Modal";
import {
  useCreateRecruitmentRequest,
  useUpdateRecruitmentRequest,
  useRecruitmentRequest,
  useApproveRecruitmentRequest,
  useRejectRecruitmentRequest,
} from "./hooks/useRecruitmentRequests";
import LoadingContent from "../../components/ui/LoadingContent";

export default function RecruitmentRequestAdd() {
  const { id } = useParams();
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isViewMode = !!id;
  const [isEditing, setIsEditing] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    numberOfPositions: 1,
    priorityLevel: "HIGH",
    reason: "",
    description: "",
    requirements: "",
    benefits: "",
    isExceedBudget: false,
    salaryMin: null,
    salaryMax: null,
    currency: "VND",
    location: "",
    jobCategoryId: 1,
    requesterId: user?.id || null,
    departmentId: user?.department?.id || null, // Always use logged-in user's department
  });

  const [selectedValues, setSelectedValues] = useState([]);

  const {
    data: existingRequest,
    isLoading: requestLoading,
    isError: requestError,
  } = useRecruitmentRequest(id);

  useEffect(() => {
    if (requestError) {
      toast.error(t("errorLoadRequest"));
    }
  }, [requestError, t]);

  useEffect(() => {
    if (existingRequest && isViewMode) {
      const locations = [
        { id: 1, name: "Hà Nội" },
        { id: 2, name: "Hải Phòng" },
        { id: 3, name: "TP. Hồ Chí Minh" },
      ];

      setFormData({
        title: existingRequest.title || "",
        numberOfPositions: existingRequest.numberOfPositions || 1,
        priorityLevel: existingRequest.priorityLevel || "HIGH",
        reason: existingRequest.reason || "",
        description: existingRequest.description || "",
        requirements: existingRequest.requirements || "",
        benefits: existingRequest.benefits || "",
        isExceedBudget: existingRequest.isExceedBudget || false,
        salaryMin: existingRequest.salaryMin || null,
        salaryMax: existingRequest.salaryMax || null,
        currency: existingRequest.currency || "VND",
        location: existingRequest.location || "",
        jobCategoryId: existingRequest.jobCategoryId || 1,
        requesterId: existingRequest.requesterId || user?.id || null,
        departmentId: user?.department?.id || null, // Always use logged-in user's department
      });

      if (existingRequest.location) {
        const locationNames = existingRequest.location.split(", ");
        const selectedIds = locations
          .filter((loc) => locationNames.includes(loc.name))
          .map((loc) => loc.id);
        setSelectedValues(selectedIds);
      }
    }
  }, [existingRequest, isViewMode, user]);

  const createMutation = useCreateRecruitmentRequest();
  const updateMutation = useUpdateRecruitmentRequest();
  const approveMutation = useApproveRecruitmentRequest();
  const rejectMutation = useRejectRecruitmentRequest();

  const locations = [
    {
      id: 1,
      name: "Hà Nội",
    },
    {
      id: 2,
      name: "Hải Phòng",
    },
    {
      id: 3,
      name: "TP. Hồ Chí Minh",
    },
  ];

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSelectedValues = (value) => {
    setSelectedValues((prev) => {
      const newValues = prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value];

      // Update formData.location with selected location names
      const selectedNames = locations
        .filter((loc) => newValues.includes(loc.id))
        .map((loc) => loc.name)
        .join(", ");

      setFormData((prevData) => ({
        ...prevData,
        location: selectedNames,
      }));

      return newValues;
    });
  };

  const onSubmit = () => {
    if (!formData.title) {
      toast.error(t("errorPositionRequired"));
      return;
    }
    if (!formData.departmentId) {
      toast.error(t("errorDepartmentRequired"));
      return;
    }
    if (!formData.numberOfPositions || formData.numberOfPositions < 1) {
      toast.error(t("errorPositionCountInvalid"));
      return;
    }
    if (!formData.reason) {
      toast.error(t("errorReasonRequired"));
      return;
    }

    // Only validate salary if exceedBudget is checked
    if (formData.isExceedBudget) {
      if (!formData.salaryMin || formData.salaryMin < 0) {
        toast.error(t("errorMinSalaryRequired"));
        return;
      }
      if (!formData.salaryMax || formData.salaryMax < 0) {
        toast.error(t("errorMaxSalaryRequired"));
        return;
      }
      if (
        formData.salaryMin &&
        formData.salaryMax &&
        formData.salaryMin > formData.salaryMax
      ) {
        toast.error(t("errorSalaryInvalid"));
        return;
      }
    }

    if (isViewMode && isEditing) {
      updateMutation.mutate(
        { id, data: formData },
        {
          onSuccess: () => {
            setIsEditing(false);
            toast.success(t("updateSuccess"));
          },
          onError: (error) => {
            console.error("Error updating request:", error);
            const errorMessage =
              error.response?.data?.message || t("errorUpdateRequest");
            toast.error(errorMessage);
          },
        }
      );
    } else if (!isViewMode) {
      createMutation.mutate(formData, {
        onSuccess: () => {
          navigate(-1);
        },
        onError: (error) => {
          console.error("Error creating request:", error);
          const errorMessage =
            error.response?.data?.message || t("errorCreateRequest");
          toast.error(errorMessage);
        },
      });
    }
  };

  const handleApprove = () => {
    if (!id) return;

    const approvalData = {
      approvalNotes: "Đã duyệt bởi CEO",
    };

    approveMutation.mutate(
      { id, data: approvalData },
      {
        onSuccess: () => {
          toast.success(t("approveSuccess") || "Yêu cầu đã được phê duyệt");
          // Refetch để cập nhật UI
        },
      }
    );
  };

  const handleReject = () => {
    if (!id) return;
    setShowRejectDialog(true);
  };

  const confirmReject = () => {
    if (rejectMutation.isPending) return;

    if (!rejectionReason || !rejectionReason.trim()) {
      toast.error("Vui lòng nhập lý do từ chối");
      return;
    }

    const rejectData = {
      reason: rejectionReason.trim(),
    };

    rejectMutation.mutate(
      { id, data: rejectData },
      {
        onSuccess: () => {
          setShowRejectDialog(false);
          setRejectionReason("");
        },
      }
    );
  };

  const isPending =
    createMutation.isPending ||
    updateMutation.isPending ||
    approveMutation.isPending ||
    rejectMutation.isPending;

  const isCEO = user?.role?.name === "CEO";
  const isApproved = existingRequest?.status === "APPROVED";
  const isRejected = existingRequest?.status === "REJECTED";
  const isPendingApproval = existingRequest?.status === "PENDING";
  const canEdit = isViewMode && !isApproved && !isCEO;
  const canApprove = isViewMode && isCEO && isPendingApproval;

  const getCurrentStatus = () => {
    if (!isViewMode) return "DRAFT";
    return existingRequest?.status || "DRAFT";
  };

  const currentStatus = getCurrentStatus();

  const progressSteps = [
    { key: "DRAFT", label: t("waitingSubmit") },
    { key: "PENDING", label: t("processing") },
    { key: "APPROVED", label: t("approved") },
    { key: "REJECTED", label: t("rejected") },
  ];

  const getStepStyle = (stepKey) => {
    if (currentStatus === stepKey) {
      return "text-[#DC2626] text-sm border-b-2 border-[#DC2626] pb-1 font-semibold";
    }
    return "text-[#A3A3A3] text-sm";
  };

  if (requestLoading && isViewMode) {
    return (
      <div className="flex flex-col h-full">
        <ContentHeader
          title={isViewMode ? t("requestDetail") : t("addRecruitmentRequest")}
          actions={
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              disabled={true}
            >
              {t("close")}
            </Button>
          }
        />
        <div className="flex-1 flex items-center justify-center mt-4">
          <LoadingContent />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <ContentHeader
        title={isViewMode ? t("requestDetail") : t("addRecruitmentRequest")}
        actions={
          <>
            {/* CEO Actions - Approve/Reject */}
            {canApprove && (
              <>
                <Button onClick={handleApprove} disabled={isPending}>
                  {approveMutation.isPending
                    ? t("approving") || "Đang phê duyệt..."
                    : t("approve") || "Phê duyệt"}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleReject}
                  disabled={isPending}
                  className="border-red-600 text-red-600 hover:bg-red-50"
                >
                  {rejectMutation.isPending
                    ? t("rejecting") || "Đang từ chối..."
                    : t("reject") || "Từ chối"}
                </Button>
              </>
            )}

            {/* Non-CEO Actions - Edit */}
            {isViewMode && !isEditing && canEdit && (
              <Button onClick={() => setIsEditing(true)}>{t("edit")}</Button>
            )}
            {isViewMode && isEditing && (
              <Button onClick={() => onSubmit()} disabled={isPending}>
                {isPending ? t("updating") : t("update")}
              </Button>
            )}

            {/* Create Mode */}
            {!isViewMode && (
              <Button onClick={() => onSubmit()} disabled={isPending}>
                {isPending ? t("saving") : t("saveRequest")}
              </Button>
            )}

            {/* Close/Cancel Button */}
            <Button
              variant="outline"
              onClick={() => {
                if (isEditing) {
                  setIsEditing(false);
                } else {
                  navigate(-1);
                }
              }}
              disabled={isPending}
            >
              {isEditing ? t("cancel") : isViewMode ? t("close") : t("cancel")}
            </Button>
          </>
        }
      />
      <div
        className="flex-1 flex flex-col mt-4 overflow-y-auto
        p-6 gap-4 bg-white rounded-xl shadow"
      >
        {/* progress */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {progressSteps.map((step, index) => (
            <div key={step.key} className="flex items-center">
              <div className="flex items-center">
                <span className={getStepStyle(step.key)}>{step.label}</span>
              </div>
              {index < progressSteps.length - 1 && (
                <ChevronRight className="text-[#E0E0E0] ml-2" size={20} />
              )}
            </div>
          ))}
        </div>
        {/* form */}
        <div className="flex flex-col gap-4">
          {/* general info */}
          <div className="rounded-md border border-gray-300 p-4 gap-4 flex flex-col">
            <h2>{t("generalInfo")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
              <TextInput
                label={t("requester")}
                placeholder={user.name || t("requesterPlaceholder")}
                readOnly={true}
              />

              <TextInput
                label={t("department")}
                placeholder={user?.department?.name || t("department")}
                readOnly={true}
                value={user?.department?.name || ""}
              />

              <TextInput
                label={t("positionLabel")}
                placeholder={t("positionPlaceholder")}
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required={true}
                disabled={isPending || (isViewMode && !isEditing)}
              />

              <SelectDropdown
                label={t("priorityLevel")}
                placeholder={t("priorityPlaceholder")}
                options={[
                  { id: "HIGH", name: t("high") },
                  { id: "MEDIUM", name: t("medium") },
                  { id: "LOW", name: t("low") },
                ]}
                value={formData.priorityLevel}
                onChange={(value) => {
                  setFormData((prev) => ({ ...prev, priorityLevel: value }));
                }}
                required={true}
                disabled={isPending || (isViewMode && !isEditing)}
              />
            </div>
          </div>
          {/* recruitment details */}
          <div className="rounded-md border border-gray-300 p-4 gap-4 flex flex-col">
            <h2>{t("recruitmentInfo")}</h2>
            <div className="gap-4 flex flex-col">
              <TextInput
                label={t("numberOfPositionsLabel")}
                placeholder={t("numberOfPositionsPlaceholder")}
                type="number"
                name="numberOfPositions"
                value={formData.numberOfPositions}
                onChange={handleChange}
                required={true}
                disabled={isPending || (isViewMode && !isEditing)}
              />

              <CheckBoxOptions
                isRow={true}
                label={t("workplace")}
                required={true}
                options={locations}
                selectedValues={selectedValues}
                onChange={handleSelectedValues}
                disabled={isViewMode && !isEditing}
              />

              <TextInput
                isRow={true}
                label={t("recruitmentReason")}
                placeholder={t("recruitmentReasonPlaceholder")}
                type="text"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                required={true}
                disabled={isPending || (isViewMode && !isEditing)}
              />

              {/* Exceed Budget Checkbox */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isExceedBudget"
                  checked={formData.isExceedBudget}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      isExceedBudget: e.target.checked,
                      // Reset salary values when unchecking
                      salaryMin: e.target.checked ? prev.salaryMin : null,
                      salaryMax: e.target.checked ? prev.salaryMax : null,
                    }));
                  }}
                  disabled={isPending || (isViewMode && !isEditing)}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <label
                  htmlFor="isExceedBudget"
                  className="text-sm text-gray-700 cursor-pointer select-none"
                >
                  {t("exceedBudget")}
                </label>
              </div>

              {/* Salary fields - only show when isExceedBudget is checked */}
              {formData.isExceedBudget && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextInput
                    label={t("minSalary")}
                    placeholder={t("salaryPlaceholder")}
                    type="number"
                    name="salaryMin"
                    value={formData.salaryMin || ""}
                    onChange={handleChange}
                    required={true}
                    disabled={isPending || (isViewMode && !isEditing)}
                  />
                  <TextInput
                    label={t("maxSalary")}
                    placeholder={t("salaryPlaceholder")}
                    type="number"
                    name="salaryMax"
                    value={formData.salaryMax || ""}
                    onChange={handleChange}
                    required={true}
                    disabled={isPending || (isViewMode && !isEditing)}
                  />
                </div>
              )}
            </div>
          </div>
          {/* justification */}
          <div className="rounded-md border border-gray-300 p-4 gap-4 flex flex-col">
            <h2>{t("jobDescriptionSection")}</h2>
            <textarea
              placeholder={t("jobDescriptionPlaceholder")}
              className="border border-gray-300 p-2 rounded-md text-gray-700
              focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent
              disabled:opacity-50 disabled:cursor-not-allowed
              min-h-[100px] resize-y
              "
              value={formData.description}
              name="description"
              onChange={handleChange}
              disabled={isPending || (isViewMode && !isEditing)}
            />
            <textarea
              placeholder={t("requirementsPlaceholder")}
              className="border border-gray-300 p-2 rounded-md text-gray-700
              focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent
              disabled:opacity-50 disabled:cursor-not-allowed
              min-h-[100px] resize-y
              "
              value={formData.requirements}
              name="requirements"
              onChange={handleChange}
              disabled={isPending || (isViewMode && !isEditing)}
            />
            <textarea
              placeholder={t("benefitsPlaceholder")}
              className="border border-gray-300 p-2 rounded-md text-gray-700
              focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent
              disabled:opacity-50 disabled:cursor-not-allowed
              min-h-[100px] resize-y
              "
              value={formData.benefits}
              name="benefits"
              onChange={handleChange}
              disabled={isPending || (isViewMode && !isEditing)}
            />
          </div>
        </div>
      </div>

      {/* Reject Dialog */}
      <Modal
        isOpen={showRejectDialog}
        onClose={() => {
          if (!rejectMutation.isPending) {
            setShowRejectDialog(false);
            setRejectionReason("");
          }
        }}
        size="md"
      >
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative">
          {/* Close button */}
          {!rejectMutation.isPending && (
            <div
              onClick={() => {
                setShowRejectDialog(false);
                setRejectionReason("");
              }}
              className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer z-10"
              aria-label="Close"
            >
              <X className="h-4 w-4 text-gray-500" />
            </div>
          )}

          <div className="p-6 pr-12">
            {/* Icon & Content */}
            <div className="flex gap-4 mb-4">
              {/* Icon */}
              <div className="flex-shrink-0 w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
                <AlertTriangle className="h-6 w-6" />
              </div>

              {/* Text Content */}
              <div className="flex-1">
                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Từ chối yêu cầu
                </h3>

                {/* Message */}
                <p className="text-sm text-gray-600 leading-relaxed">
                  Vui lòng nhập lý do từ chối yêu cầu này
                </p>
              </div>
            </div>
          </div>

          {/* Input field */}
          <div className="px-6 pb-6">
            <textarea
              placeholder="Nhập lý do từ chối..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              disabled={rejectMutation.isPending}
              rows={3}
              className="w-full border border-gray-300 p-2 rounded-md text-gray-700
                focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent
                disabled:opacity-50 disabled:cursor-not-allowed resize-y"
            />
          </div>

          {/* Actions */}
          <div className="px-6 pb-6 flex gap-3 border-t border-gray-100">
            <Button
              variant="outline"
              onClick={() => {
                setShowRejectDialog(false);
                setRejectionReason("");
              }}
              disabled={rejectMutation.isPending}
              className="flex-1"
            >
              Hủy
            </Button>
            <Button
              onClick={confirmReject}
              disabled={rejectMutation.isPending || !rejectionReason.trim()}
              className="flex-1"
            >
              {rejectMutation.isPending ? "Đang xử lý..." : "Từ chối"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
