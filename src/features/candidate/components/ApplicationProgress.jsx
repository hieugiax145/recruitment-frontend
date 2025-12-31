import { FileText, CheckCircle2, MessageSquare } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function ApplicationProgress({ status, isHR, onStatusChange, isUpdating, statuses }) {
  const { t } = useTranslation();

  const steps = [
    {
      key: "SUBMITTED",
      label: t("applicationSteps.submitted"),
      icon: FileText,
    },
    {
      key: "SCREENING",
      label: t("applicationSteps.screening"),
      icon: CheckCircle2,
    },
    {
      key: "INTERVIEW",
      label: t("applicationSteps.interview"),
      icon: MessageSquare,
    },
    { key: "OFFER", label: t("applicationSteps.offer"), icon: FileText },
    { key: "HIRED", label: t("applicationSteps.hired"), icon: CheckCircle2 },
  ];

  const statusOrder = {
    SUBMITTED: 0,
    SCREENING: 1,
    INTERVIEW: 2,
    OFFER: 3,
    HIRED: 4,
    REJECTED: -1,
  };

  const currentStep = statusOrder[status] ?? 0;
  const isRejected = status === "REJECTED";

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <CheckCircle2 size={18} />
          {t("applicationProgress")}
        </h3>
        {isHR && statuses && (
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            disabled={isUpdating}
            className="text-sm font-medium rounded-lg px-3 py-2 border-0 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: `${statuses.find(s => s.id === status)?.color}15`,
              color: statuses.find(s => s.id === status)?.color
            }}
          >
            {statuses.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="relative">
        {/* Progress Bar Background */}
        <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200" />

        {/* Progress Bar Fill */}
        {!isRejected && (
          <div
            className="absolute top-6 left-0 h-0.5 bg-red-600 transition-all duration-500"
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          />
        )}

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = index <= currentStep && !isRejected;
            const isCurrent = index === currentStep && !isRejected;

            return (
              <div key={step.key} className="flex flex-col items-center">
                {/* Step Circle */}
                <div
                  className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${
                    isCompleted
                      ? "bg-red-600 border-red-600 text-white"
                      : "bg-white border-gray-300 text-gray-400"
                  } ${isCurrent ? "ring-4 ring-red-100" : ""}`}
                >
                  <Icon size={20} />
                </div>

                {/* Step Label */}
                <div className="mt-3 text-center">
                  <div
                    className={`text-sm font-medium ${
                      isCompleted ? "text-gray-900" : "text-gray-500"
                    }`}
                  >
                    {step.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Rejected Status */}
        {isRejected && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-700">
              <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center">
                ✕
              </div>
              <span className="font-medium">{t("applicationRejected")}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
