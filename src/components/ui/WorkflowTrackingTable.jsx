import { useTranslation } from "react-i18next";

/**
 * Reusable Workflow Tracking Table Component
 * Displays approval workflow steps with their tracking history
 * 
 * @param {Object} workflowInfo - Workflow information object
 * @param {Object} workflowInfo.workflow - Workflow details with steps
 * @param {Array} workflowInfo.workflow.steps - Array of workflow steps
 * @param {Array} workflowInfo.approvalTrackings - Array of approval tracking records
 * @param {string} workflowInfo.currentStepId - ID of the current active step
 * @param {string} className - Optional additional CSS classes
 */
export default function WorkflowTrackingTable({ workflowInfo, className = "" }) {
    const { t } = useTranslation();

    if (!workflowInfo?.workflow) {
        return null;
    }

    return (
        <div className={`bg-white rounded-xl shadow overflow-hidden ${className}`}>
            <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                    {t("recruitmentRequests.approvalStepsTitle")}
                </h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-red-50">
                        <tr>
                            <th className="p-4 text-left text-sm font-medium text-gray-600 whitespace-nowrap">
                                {t("recruitmentRequests.stepOrder")}
                            </th>
                            <th className="p-4 text-left text-sm font-medium text-gray-600 whitespace-nowrap">
                                {t("recruitmentRequests.stepName")}
                            </th>
                            <th className="p-4 text-left text-sm font-medium text-gray-600 whitespace-nowrap">
                                {t("recruitmentRequests.processingStatus")}
                            </th>
                            <th className="p-4 text-left text-sm font-medium text-gray-600 whitespace-nowrap">
                                {t("recruitmentRequests.assignedPerson")}
                            </th>
                            <th className="p-4 text-left text-sm font-medium text-gray-600 whitespace-nowrap">
                                {t("recruitmentRequests.time")}
                            </th>
                            <th className="p-4 text-left text-sm font-medium text-gray-600 whitespace-nowrap">
                                {t("notes")}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {workflowInfo.workflow.steps.map((step) => {
                            const approvalTrackings = Array.isArray(workflowInfo.approvalTrackings)
                                ? workflowInfo.approvalTrackings.filter(tr => tr.stepId === step.id)
                                : [];
                            
                            let trackingStatus = t("recruitmentRequests.notProcessed");
                            let actionUserName = "-";
                            let actionTime = "-";
                            let notes = "-";
                            
                            const isCurrentStep = workflowInfo.currentStepId === step.id;
                            
                            if (approvalTrackings.length > 0) {
                                const latestTracking = approvalTrackings[approvalTrackings.length - 1];
                                const status = latestTracking.status;
                                
                                if (status === "APPROVED") trackingStatus = t("statuses.approved");
                                else if (status === "REJECTED") trackingStatus = t("statuses.rejected");
                                else if (status === "RETURNED") trackingStatus = t("statuses.returned");
                                else if (status === "CANCELLED") trackingStatus = t("statuses.cancelled");
                                else if (status === "PENDING") trackingStatus = t("statuses.pending");
                                else trackingStatus = status;
                                
                                actionUserName = latestTracking.actionUserName || "-";
                                
                                if (latestTracking.actionAt) {
                                    actionTime = new Date(latestTracking.actionAt).toLocaleString("vi-VN");
                                }
                                
                                notes = latestTracking.notes || "-";
                            }
                            
                            return (
                                <tr 
                                    key={step.id} 
                                    className={`border-b last:border-b-0 border-gray-200 ${
                                        isCurrentStep ? "bg-yellow-50" : "hover:bg-gray-50"
                                    }`}
                                >
                                    <td className="p-4 text-sm whitespace-nowrap">{step.stepOrder}</td>
                                    <td className={`p-4 text-sm whitespace-nowrap ${isCurrentStep ? "font-semibold" : ""}`}>
                                        {step.approverPositionName}
                                    </td>
                                    <td className="p-4 text-sm whitespace-nowrap">{trackingStatus}</td>
                                    <td className="p-4 text-sm whitespace-nowrap max-w-[150px] truncate">
                                        {actionUserName}
                                    </td>
                                    <td className="p-4 text-sm whitespace-nowrap">{actionTime}</td>
                                    <td className="p-4 text-sm max-w-[200px] truncate" title={notes}>
                                        {notes}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
