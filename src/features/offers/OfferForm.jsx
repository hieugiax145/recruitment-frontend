import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronRight, X, AlertTriangle } from "lucide-react";
import WorkflowTrackingTable from "../../components/ui/WorkflowTrackingTable";
import { useCandidates } from "../candidate/hooks/useCandidates";
import { useCandidate } from "../candidate/hooks/useCandidates";
import { useWorkflows } from "../../hooks/useWorkflows";
import { useAuth } from "../../context/AuthContext";
import { 
  useOffer, 
  useCreateOffer, 
  useUpdateOffer,
  useSubmitOffer,
  useApproveOffer,
  useRejectOffer,
  useReturnOffer,
  useCancelOffer,
  useWithdrawOffer
} from "./hooks/useOffers";
import ContentHeader from "../../components/ui/ContentHeader";
import SelectDropdown from "../../components/ui/SelectDropdown";
import TextInput from "../../components/ui/TextInput";
import TextArea from "../../components/ui/TextArea";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import LoadingContent from "../../components/ui/LoadingContent";
import { formatNumber, parseFormattedNumber } from "../../utils/utils";
import { toast } from "react-toastify";

export default function OfferForm() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { id } = useParams();
    const { user } = useAuth();
    const isViewMode = !!id;
    const [isEditing, setIsEditing] = useState(false);
    
    // Dialog states
    const [showRejectDialog, setShowRejectDialog] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");
    const [showSubmitDialog, setShowSubmitDialog] = useState(false);
    const [showReturnDialog, setShowReturnDialog] = useState(false);
    const [returnReason, setReturnReason] = useState("");
    const [showCancelDialog, setShowCancelDialog] = useState(false);
    const [cancelReason, setCancelReason] = useState("");
    const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);
    
    const [form, setForm] = useState({
        candidateId: null,
        positionId: null,
        positionName: "",
        departmentName: "",
        positionLevel: "",
        workflowId: null,
        basicSalary: "",
        probationPercentage: "85",
        onboardingDate: "",
        probationPeriod: "2",
        notes: "",
    });

    const createOfferMutation = useCreateOffer();
    const updateOfferMutation = useUpdateOffer();
    const { data: offerData, isLoading: isLoadingOffer } = useOffer(id, { enabled: isViewMode });

    const setValue = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
    const watch = (key) => form[key];

    const selectedCandidateId = watch("candidateId");

    const { data: candidatesData, isLoading: isLoadingCandidates } = useCandidates({ status: "INTERVIEW" });
    const candidates = Array.isArray(candidatesData?.data?.result) ? candidatesData.data.result : [];

    const { data: selectedCandidateData, isLoading: isLoadingSelectedCandidate } = useCandidate(selectedCandidateId, {
        enabled: !!selectedCandidateId && !isViewMode,
    });

    // Load offer data when editing
    useEffect(() => {
        if (offerData?.data && isViewMode) {
            const offer = offerData.data;
            setForm({
                candidateId: offer.candidateId || null,
                positionId: null,
                positionName: offer.jobPositionTitle || "",
                departmentName: offer.departmentName || "",
                positionLevel: offer.levelName || "",
                workflowId: offer.workflowId || null,
                basicSalary: offer.basicSalary || "",
                probationPercentage: offer.probationSalaryRate?.toString() || "85",
                onboardingDate: offer.onboardingDate ? offer.onboardingDate.split('T')[0] : "",
                probationPeriod: offer.probationPeriod?.toString() || "2",
                notes: offer.notes || "",
            });
        }
    }, [offerData, isViewMode]);

    useEffect(() => {
        if (selectedCandidateData?.data?.jobPosition) {
            const position = selectedCandidateData.data.jobPosition;
            setValue("positionId", position.id || null);
            setValue("positionName", position.title || "");
            setValue("departmentName", position.departmentName || "");
            setValue("positionLevel", position.experienceLevel || "");
            if (position.salaryMin) setValue("basicSalary", position.salaryMin);
        }
    }, [selectedCandidateData]);

    const { data: workflowsData } = useWorkflows({ type: "OFFER" });
    const workflows = Array.isArray(workflowsData?.data?.result)
        ? workflowsData.data.result
        : Array.isArray(workflowsData?.result)
        ? workflowsData.result
        : [];

    const headerTitle = isViewMode ? t("offers.editOffer") : t("offers.createOffer");

    const handleSubmit = () => {
        if (!form.candidateId) {
            toast.error(t("offers.validation.selectCandidate"));
            return;
        }
        if (!form.workflowId) {
            toast.error(t("offers.validation.selectWorkflow"));
            return;
        }
        if (!form.basicSalary) {
            toast.error(t("offers.validation.enterBasicSalary"));
            return;
        }
        if (!form.onboardingDate) {
            toast.error(t("offers.validation.selectOnboardingDate"));
            return;
        }

        const payload = {
            candidateId: form.candidateId,
            positionId: form.positionId,
            workflowId: form.workflowId,
            basicSalary: parseFormattedNumber(form.basicSalary) || 0,
            probationSalaryRate: parseFloat(form.probationPercentage) || 85,
            onboardingDate: form.onboardingDate,
            probationPeriod: parseInt(form.probationPeriod) || 2,
            notes: form.notes || "",
        };

        if (isViewMode) {
            updateOfferMutation.mutate(
                { id, data: payload },
                {
                    onSuccess: () => {
                        toast.success(t("offers.updateSuccess"));
                        navigate("/offers");
                    },
                }
            );
        } else {
            createOfferMutation.mutate(payload, {
                onSuccess: () => {
                    toast.success(t("offers.createSuccess"));
                    navigate("/offers");
                },
            });
        }
    };

    const submitOfferMutation = useSubmitOffer();
    const approveOfferMutation = useApproveOffer();
    const rejectOfferMutation = useRejectOffer();
    const returnOfferMutation = useReturnOffer();
    const cancelOfferMutation = useCancelOffer();
    const withdrawOfferMutation = useWithdrawOffer();

    const handleApproveOffer = () => {
        if (!id) return;
        approveOfferMutation.mutate(
            { id, data: { approvalNotes: "_" } },
            {
                onSuccess: () => {
                    toast.success(t("approveSuccess"));
                },
            }
        );
    };

    const handleRejectOffer = () => {
        if (!id) return;
        setShowRejectDialog(true);
    };

    const confirmReject = () => {
        if (rejectOfferMutation.isPending) return;
        if (!rejectionReason || !rejectionReason.trim()) {
            toast.error(t("toasts.pleaseEnterRejectionReason"));
            return;
        }
        rejectOfferMutation.mutate(
            { id, data: { reason: rejectionReason.trim() } },
            {
                onSuccess: () => {
                    setShowRejectDialog(false);
                    setRejectionReason("");
                },
            }
        );
    };

    const handleSubmitOffer = () => {
        if (!id) return;
        setShowSubmitDialog(true);
    };

    const confirmSubmit = () => {
        submitOfferMutation.mutate(
            { id, data: {} },
            {
                onSuccess: () => {
                    setShowSubmitDialog(false);
                },
            }
        );
    };

    const handleReturnOffer = () => {
        if (!id) return;
        setShowReturnDialog(true);
    };

    const confirmReturn = () => {
        if (returnOfferMutation.isPending) return;
        if (!returnReason || !returnReason.trim()) {
            toast.error(t("toasts.pleaseEnterReturnReason"));
            return;
        }
        returnOfferMutation.mutate(
            { id, data: { reason: returnReason.trim() } },
            {
                onSuccess: () => {
                    setShowReturnDialog(false);
                    setReturnReason("");
                },
            }
        );
    };

    const handleCancelOffer = () => {
        if (!id) return;
        setShowCancelDialog(true);
    };

    const confirmCancel = () => {
        if (cancelOfferMutation.isPending) return;
        if (!cancelReason || !cancelReason.trim()) {
            toast.error(t("toasts.pleaseEnterCancellationReason"));
            return;
        }
        cancelOfferMutation.mutate(
            { id, data: { reason: cancelReason.trim() } },
            {
                onSuccess: () => {
                    setShowCancelDialog(false);
                    setCancelReason("");
                },
            }
        );
    };

    const handleWithdrawOffer = () => {
        if (!id) return;
        setShowWithdrawDialog(true);
    };

    const confirmWithdraw = () => {
        withdrawOfferMutation.mutate(
            { id, data: {} },
            {
                onSuccess: () => {
                    setShowWithdrawDialog(false);
                },
            }
        );
    };

    const isLoading = createOfferMutation.isPending || updateOfferMutation.isPending;

    const isPending =
        createOfferMutation.isPending ||
        updateOfferMutation.isPending ||
        approveOfferMutation.isPending ||
        rejectOfferMutation.isPending ||
        submitOfferMutation.isPending ||
        returnOfferMutation.isPending ||
        cancelOfferMutation.isPending ||
        withdrawOfferMutation.isPending;

    const isDraft = offerData?.data?.status === "DRAFT";
    const isPendingStatus = offerData?.data?.status === "PENDING";
    const isApproved = offerData?.data?.status === "APPROVED";
    const isRejected = offerData?.data?.status === "REJECTED";

    const isCreator = offerData?.data?.requesterId === user?.userId;

    const currentApprovalTracking = offerData?.data?.workflowInfo?.approvalTrackings?.find(
        (t) => t.stepId === offerData?.data?.workflowInfo?.currentStepId
    );
    const isCurrentActionUser = currentApprovalTracking?.actionUserId === user?.userId;

    const canSubmit = isViewMode && isCreator && isDraft;
    const canApprove = isViewMode && isPendingStatus && isCurrentActionUser;
    const canRejectOffer = isViewMode && isPendingStatus && isCurrentActionUser;
    const canReturn = isViewMode && isPendingStatus && isCurrentActionUser;

    const getCurrentStatus = () => {
        if (!isViewMode) return "DRAFT";
        return offerData?.data?.status || "DRAFT";
    };

    const currentStatus = getCurrentStatus();

    const progressSteps = [
        { key: "DRAFT", label: t("statuses.draft") },
        { key: "PENDING", label: t("statuses.pending") },
        { key: "APPROVED", label: t("statuses.approved") },
        { key: "REJECTED", label: t("statuses.rejected") },
    ];

    const getStepStyle = (stepKey) => {
        if (currentStatus === stepKey) {
            return "text-[#DC2626] text-sm border-b-2 border-[#DC2626] pb-1 font-semibold";
        }
        return "text-[#A3A3A3] text-sm";
    };

    if ((isViewMode && isLoadingOffer) || isLoadingCandidates) {
        return (
            <div className="flex flex-col h-full">
                <ContentHeader title={headerTitle} />
                <div className="flex-1 flex items-center justify-center mt-4">
                    <LoadingContent />
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            <ContentHeader
                title={headerTitle}
                actions={
                    <>
                        {/* Submit Action */}
                        {canSubmit && (
                            <Button onClick={handleSubmitOffer} disabled={isPending}>
                                {submitOfferMutation.isPending ? t("buttons.submitting") : t("recruitmentRequests.submitRequest")}
                            </Button>
                        )}

                        {/* Approver Actions */}
                        {canApprove && (
                            <Button onClick={handleApproveOffer} disabled={isPending}>
                                {approveOfferMutation.isPending ? t("approving") : t("approve")}
                            </Button>
                        )}

                        {canRejectOffer && (
                            <Button
                                variant="outline"
                                onClick={handleRejectOffer}
                                disabled={isPending}
                                className="border-red-600 text-red-600 hover:bg-red-50"
                            >
                                {rejectOfferMutation.isPending ? t("rejecting") : t("reject")}
                            </Button>
                        )}

                        {canReturn && (
                            <Button
                                variant="outline"
                                onClick={handleReturnOffer}
                                disabled={isPending}
                                className="border-yellow-600 text-yellow-600 hover:bg-yellow-50"
                            >
                                {returnOfferMutation.isPending ? t("buttons.returning") : t("buttons.return")}
                            </Button>
                        )}

                        {/* Create Mode */}
                        {!isViewMode && (
                            <Button onClick={() => handleSubmit()} disabled={isPending}>
                                {isPending ? t("saving") : t("offers.createOffer")}
                            </Button>
                        )}

                        {/* Close/Cancel Button */}
                        <Button
                            variant="outline"
                            onClick={() => navigate("/offers")}
                            disabled={isPending}
                        >
                            {isViewMode ? t("close") : t("cancel")}
                        </Button>
                    </>
                }
            />

            <div className="flex-1 flex flex-col mt-4 overflow-y-auto p-6 gap-4 bg-white rounded-xl shadow">
                {/* Progress Steps */}
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

                {/* Steps & Tracking Table - only in view mode and has workflow */}
                {isViewMode && offerData?.data?.workflowInfo?.workflow && (
                    <WorkflowTrackingTable workflowInfo={offerData.data.workflowInfo} className="mb-4" />
                )}

                {/* Thông tin ứng viên và vị trí */}
                <div className="border border-gray-200 rounded-lg p-4 space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">{t("offers.candidateInfo")}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <SelectDropdown
                                label={t("offers.candidate")}
                                value={form.candidateId}
                                onChange={(val) => setValue("candidateId", val)}
                                options={candidates.map((c) => ({ id: c.id, name: c.name }))}
                                placeholder={t("offers.selectCandidate")}
                                disabled={isLoadingCandidates || isViewMode || isLoading}
                                required
                            />

                            <TextInput label={t("offers.appliedPosition")} value={form.positionName || "-"} disabled />
                            <TextInput label={t("department")} value={form.departmentName || "-"} disabled />
                            <TextInput label={t("offers.level")} value={form.positionLevel || "-"} disabled />
                        </div>
                    </div>

                    {/* Thông tin lương */}
                    <div className="border border-gray-200 rounded-lg p-4 space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">{t("offers.salaryInfo")}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <TextInput
                                label={t("offers.basicSalary")}
                                placeholder="0"
                                type="text"
                                value={formatNumber(form.basicSalary)}
                                onChange={(e) => {
                                    const parsed = parseFormattedNumber(e.target.value);
                                    if (parsed !== null || e.target.value === "") {
                                        setValue("basicSalary", parsed);
                                    }
                                }}
                                required
                                disabled={isLoading}
                            />

                            <TextInput
                                label={t("offers.probationPercentage")}
                                type="number"
                                value={form.probationPercentage}
                                onChange={(e) => setValue("probationPercentage", e.target.value)}
                                placeholder="85"
                                min="0"
                                max="100"
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    {/* Thông tin onboarding */}
                    <div className="border border-gray-200 rounded-lg p-4 space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">{t("offers.onboardingInfo")}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <TextInput
                                label={t("offers.onboardingDate")}
                                type="date"
                                value={form.onboardingDate}
                                onChange={(e) => setValue("onboardingDate", e.target.value)}
                                required
                                disabled={isLoading}
                            />

                            <TextInput
                                label={t("offers.probationPeriod")}
                                type="number"
                                value={form.probationPeriod}
                                onChange={(e) => setValue("probationPeriod", e.target.value)}
                                placeholder="2"
                                min="0"
                                max="12"
                                required
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    {/* Workflow */}
                    <div className="border border-gray-200 rounded-lg p-4 space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">{t("offers.approvalWorkflow")}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <SelectDropdown
                                label={t("recruitmentRequests.workflow")}
                                value={form.workflowId}
                                onChange={(val) => setValue("workflowId", val)}
                                options={workflows.map((w) => ({ id: w.id, name: w.name }))}
                                placeholder={t("recruitmentRequests.selectWorkflow")}
                                disabled={isLoading}
                                required
                            />
                        </div>

                        {/* Workflow Steps Preview - show when workflow is selected and in create mode */}
                        {!isViewMode && form.workflowId && (
                            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h3 className="text-sm font-semibold text-blue-900 mb-3">{t("recruitmentRequests.approvalStepsTitle")}</h3>
                                <div className="space-y-2">
                                    {(() => {
                                        const selectedWorkflow = workflows.find(w => w.id === form.workflowId);
                                        if (!selectedWorkflow || !selectedWorkflow.steps || selectedWorkflow.steps.length === 0) {
                                            return <p className="text-sm text-blue-700">{t("offers.noWorkflowSteps")}</p>;
                                        }
                                        return selectedWorkflow.steps
                                            .sort((a, b) => a.stepOrder - b.stepOrder)
                                            .map((step) => (
                                                <div key={step.id} className="flex items-start gap-3 text-sm">
                                                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-xs">
                                                        {step.stepOrder}
                                                    </span>
                                                    <div className="flex-1">
                                                        <p className="text-blue-900 font-medium">{`${t("recruitmentRequests.step")} ${step.stepOrder}`}</p>
                                                        <p className="text-blue-700 text-xs mt-0.5">
                                                            {t("recruitmentRequests.approver")}: {step.approverPositionName || t("recruitmentRequests.notDetermined")}
                                                        </p>
                                                    </div>
                                                </div>
                                            ));
                                    })()}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Ghi chú */}
                    <div className="border border-gray-200 rounded-lg p-4 space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">{t("notes")}</h3>
                        <TextArea
                            value={form.notes}
                            onChange={(e) => setValue("notes", e.target.value)}
                            rows={4}
                            placeholder={t("offers.notesPlaceholder")}
                            disabled={isLoading}
                        />
                    </div>

            </div>

            {/* Submit Dialog */}
            <Modal
                isOpen={showSubmitDialog}
                onClose={() => !submitOfferMutation.isPending && setShowSubmitDialog(false)}
                size="md"
            >
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative">
                    {!submitOfferMutation.isPending && (
                        <div
                            onClick={() => setShowSubmitDialog(false)}
                            className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer z-10"
                        >
                            <X className="h-4 w-4 text-gray-500" />
                        </div>
                    )}
                    <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{t("recruitmentRequests.submitDialogTitle")}</h3>
                        <p className="text-sm text-gray-600 mb-4">{t("recruitmentRequests.submitDialogMessage")}</p>
                        <div className="flex gap-3">
                            <Button variant="outline" onClick={() => setShowSubmitDialog(false)} disabled={submitOfferMutation.isPending} className="flex-1">
                                {t("cancel")}
                            </Button>
                            <Button onClick={confirmSubmit} disabled={submitOfferMutation.isPending} className="flex-1">
                                {submitOfferMutation.isPending ? t("buttons.processing") : t("common.confirm")}
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Reject Dialog */}
            <Modal
                isOpen={showRejectDialog}
                onClose={() => {
                    if (!rejectOfferMutation.isPending) {
                        setShowRejectDialog(false);
                        setRejectionReason("");
                    }
                }}
                size="md"
            >
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative">
                    {!rejectOfferMutation.isPending && (
                        <div
                            onClick={() => {
                                setShowRejectDialog(false);
                                setRejectionReason("");
                            }}
                            className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer z-10"
                        >
                            <X className="h-4 w-4 text-gray-500" />
                        </div>
                    )}
                    <div className="p-6 pr-12">
                        <div className="flex gap-4 mb-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
                                <AlertTriangle className="h-6 w-6" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t("recruitmentRequests.rejectDialogTitle")}</h3>
                                <p className="text-sm text-gray-600 leading-relaxed">{t("recruitmentRequests.rejectDialogMessage")}</p>
                            </div>
                        </div>
                    </div>
                    <div className="px-6 pb-6">
                        <textarea
                            placeholder={t("recruitmentRequests.rejectPlaceholder")}
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            disabled={rejectOfferMutation.isPending}
                            rows={3}
                            className="w-full border border-gray-300 p-2 rounded-md text-gray-700
                                focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent
                                disabled:opacity-50 disabled:cursor-not-allowed resize-y"
                        />
                    </div>
                    <div className="px-6 pb-6 flex gap-3 border-t border-gray-100">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowRejectDialog(false);
                                setRejectionReason("");
                            }}
                            disabled={rejectOfferMutation.isPending}
                            className="flex-1"
                        >
                            {t("cancel")}
                        </Button>
                        <Button
                            onClick={confirmReject}
                            disabled={rejectOfferMutation.isPending || !rejectionReason.trim()}
                            className="flex-1"
                        >
                            {rejectOfferMutation.isPending ? t("buttons.processing") : t("reject")}
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Return Dialog */}
            <Modal
                isOpen={showReturnDialog}
                onClose={() => {
                    if (!returnOfferMutation.isPending) {
                        setShowReturnDialog(false);
                        setReturnReason("");
                    }
                }}
                size="md"
            >
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative">
                    {!returnOfferMutation.isPending && (
                        <div
                            onClick={() => {
                                setShowReturnDialog(false);
                                setReturnReason("");
                            }}
                            className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer z-10"
                        >
                            <X className="h-4 w-4 text-gray-500" />
                        </div>
                    )}
                    <div className="p-6 pr-12">
                        <div className="flex gap-4 mb-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-yellow-50 text-yellow-600 rounded-xl flex items-center justify-center">
                                <AlertTriangle className="h-6 w-6" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t("recruitmentRequests.returnDialogTitle")}</h3>
                                <p className="text-sm text-gray-600 leading-relaxed">{t("recruitmentRequests.returnDialogMessage")}</p>
                            </div>
                        </div>
                    </div>
                    <div className="px-6 pb-6">
                        <textarea
                            placeholder={t("recruitmentRequests.returnPlaceholder")}
                            value={returnReason}
                            onChange={(e) => setReturnReason(e.target.value)}
                            disabled={returnOfferMutation.isPending}
                            rows={3}
                            className="w-full border border-gray-300 p-2 rounded-md text-gray-700
                                focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent
                                disabled:opacity-50 disabled:cursor-not-allowed resize-y"
                        />
                    </div>
                    <div className="px-6 pb-6 flex gap-3 border-t border-gray-100">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowReturnDialog(false);
                                setReturnReason("");
                            }}
                            disabled={returnOfferMutation.isPending}
                            className="flex-1"
                        >
                            {t("cancel")}
                        </Button>
                        <Button
                            onClick={confirmReturn}
                            disabled={returnOfferMutation.isPending || !returnReason.trim()}
                            className="flex-1"
                        >
                            {returnOfferMutation.isPending ? t("buttons.processing") : t("buttons.return")}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
