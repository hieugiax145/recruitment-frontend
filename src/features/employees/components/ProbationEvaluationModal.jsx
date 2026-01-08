import { useState } from "react";
import { useTranslation } from "react-i18next";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import TextInput from "../../../components/ui/TextInput";
import TextArea from "../../../components/ui/TextArea";
import RadioOptions from "../../../components/ui/RadioOptions";
import LoadingOverlay from "../../../components/ui/LoadingOverlay";
import { Star } from "lucide-react";

export default function ProbationEvaluationModal({ isOpen, onClose, employeeId, employeeName, onSubmit, isSubmitting }) {
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState({
    onTimeCompletionScore: "",
    workEfficiencyScore: "",
    professionalSkillScoreProbation: "",
    selfLearningScore: "",
    workAttitudeScore: "",
    communicationSkillScoreProbation: "",
    honestyResponsibilityScore: "",
    teamIntegrationScore: "",
    probationResult: "ELIGIBLE",
    additionalComments: "",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // Validate scores
    const scores = [
      formData.onTimeCompletionScore,
      formData.workEfficiencyScore,
      formData.professionalSkillScoreProbation,
      formData.selfLearningScore,
      formData.workAttitudeScore,
      formData.communicationSkillScoreProbation,
      formData.honestyResponsibilityScore,
      formData.teamIntegrationScore,
    ];

    if (scores.some((score) => !score || score < 1 || score > 5)) {
      alert(t("employeeEvaluation.probationEvaluation.scoreValidation"));
      return;
    }

    const payload = {
      type: "PROBATION",
      employeeId,
      onTimeCompletionScore: parseInt(formData.onTimeCompletionScore),
      workEfficiencyScore: parseInt(formData.workEfficiencyScore),
      professionalSkillScoreProbation: parseInt(formData.professionalSkillScoreProbation),
      selfLearningScore: parseInt(formData.selfLearningScore),
      workAttitudeScore: parseInt(formData.workAttitudeScore),
      communicationSkillScoreProbation: parseInt(formData.communicationSkillScoreProbation),
      honestyResponsibilityScore: parseInt(formData.honestyResponsibilityScore),
      teamIntegrationScore: parseInt(formData.teamIntegrationScore),
      probationResult: formData.probationResult,
      additionalComments: formData.additionalComments,
    };

    onSubmit(payload);
  };

  const resultOptions = [
    { value: "ELIGIBLE", label: t("employeeEvaluation.probationEvaluation.eligible") },
    { value: "NOT_ELIGIBLE", label: t("employeeEvaluation.probationEvaluation.notEligible") },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
        {isSubmitting && <LoadingOverlay />}
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{t("employeeEvaluation.probationEvaluation.title")}</h3>
              <p className="text-sm text-gray-600">{employeeName}</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
          <div className="space-y-6">
            {/* Scores Section */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">
                {t("employeeEvaluation.probationEvaluation.scores")}
                <span className="text-xs text-gray-500 ml-2">{t("employeeEvaluation.probationEvaluation.scoreNote")}</span>
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <TextInput
                  label={t("employeeEvaluation.probationEvaluation.onTimeCompletion")}
                  type="number"
                  min="1"
                  max="5"
                  value={formData.onTimeCompletionScore}
                  onChange={(e) => handleChange("onTimeCompletionScore", e.target.value)}
                  required
                />
                <TextInput
                  label={t("employeeEvaluation.probationEvaluation.workEfficiency")}
                  type="number"
                  min="1"
                  max="5"
                  value={formData.workEfficiencyScore}
                  onChange={(e) => handleChange("workEfficiencyScore", e.target.value)}
                  required
                />
                <TextInput
                  label={t("employeeEvaluation.probationEvaluation.professionalSkill")}
                  type="number"
                  min="1"
                  max="5"
                  value={formData.professionalSkillScoreProbation}
                  onChange={(e) => handleChange("professionalSkillScoreProbation", e.target.value)}
                  required
                />
                <TextInput
                  label={t("employeeEvaluation.probationEvaluation.selfLearning")}
                  type="number"
                  min="1"
                  max="5"
                  value={formData.selfLearningScore}
                  onChange={(e) => handleChange("selfLearningScore", e.target.value)}
                  required
                />
                <TextInput
                  label={t("employeeEvaluation.probationEvaluation.workAttitude")}
                  type="number"
                  min="1"
                  max="5"
                  value={formData.workAttitudeScore}
                  onChange={(e) => handleChange("workAttitudeScore", e.target.value)}
                  required
                />
                <TextInput
                  label={t("employeeEvaluation.probationEvaluation.communicationSkill")}
                  type="number"
                  min="1"
                  max="5"
                  value={formData.communicationSkillScoreProbation}
                  onChange={(e) => handleChange("communicationSkillScoreProbation", e.target.value)}
                  required
                />
                <TextInput
                  label={t("employeeEvaluation.probationEvaluation.honestyResponsibility")}
                  type="number"
                  min="1"
                  max="5"
                  value={formData.honestyResponsibilityScore}
                  onChange={(e) => handleChange("honestyResponsibilityScore", e.target.value)}
                  required
                />
                <TextInput
                  label={t("employeeEvaluation.probationEvaluation.teamIntegration")}
                  type="number"
                  min="1"
                  max="5"
                  value={formData.teamIntegrationScore}
                  onChange={(e) => handleChange("teamIntegrationScore", e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Result */}
            <div>
              <RadioOptions
                label={t("employeeEvaluation.probationEvaluation.result")}
                options={resultOptions}
                selectedValue={formData.probationResult}
                onChange={(value) => handleChange("probationResult", value)}
              />
            </div>

            {/* Additional Comments */}
            <div>
              <TextArea
                label={t("employeeEvaluation.probationEvaluation.additionalComments")}
                value={formData.additionalComments}
                onChange={(e) => handleChange("additionalComments", e.target.value)}
                rows={4}
                placeholder={t("employeeEvaluation.probationEvaluation.additionalCommentsPlaceholder")}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {t("employeeEvaluation.probationEvaluation.submit")}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
