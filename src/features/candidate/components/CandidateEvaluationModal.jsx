import { useState } from "react";
import { useTranslation } from "react-i18next";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import TextInput from "../../../components/ui/TextInput";
import TextArea from "../../../components/ui/TextArea";
import RadioOptions from "../../../components/ui/RadioOptions";
import LoadingOverlay from "../../../components/ui/LoadingOverlay";
import { Star } from "lucide-react";

export default function CandidateEvaluationModal({ isOpen, onClose, candidateId, candidateName, onSubmit, isSubmitting }) {
  const { t } = useTranslation();
  
  const [form, setForm] = useState({
    professionalSkillScore: "",
    communicationSkillScore: "",
    workExperienceScore: "",
    strengths: "",
    weaknesses: "",
    conclusion: "true",
  });

  const setValue = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = () => {
    const payload = {
      candidateId,
      professionalSkillScore: parseInt(form.professionalSkillScore) || 0,
      communicationSkillScore: parseInt(form.communicationSkillScore) || 0,
      workExperienceScore: parseInt(form.workExperienceScore) || 0,
      strengths: form.strengths,
      weaknesses: form.weaknesses,
      conclusion: form.conclusion,
      type: "INTERVIEW",
    };
    onSubmit(payload);
  };

  const handleClose = () => {
    setForm({
      professionalSkillScore: "",
      communicationSkillScore: "",
      workExperienceScore: "",
      strengths: "",
      weaknesses: "",
      conclusion: "true",
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden relative">
        {isSubmitting && <LoadingOverlay show={true} />}
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{t("candidates.evaluateCandidate")}</h3>
              <p className="text-sm text-gray-600">{candidateName}</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-6 space-y-6">
          {/* Điểm đánh giá */}
          <div className="border border-gray-200 rounded-lg p-4 space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">{t("candidates.evaluation.scores")}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <TextInput
                label={t("candidates.evaluation.professionalSkill")}
                type="number"
                min="1"
                max="5"
                value={form.professionalSkillScore}
                onChange={(e) => setValue("professionalSkillScore", e.target.value)}
                placeholder="1-5"
                required
              />
              <TextInput
                label={t("candidates.evaluation.communicationSkill")}
                type="number"
                min="1"
                max="5"
                value={form.communicationSkillScore}
                onChange={(e) => setValue("communicationSkillScore", e.target.value)}
                placeholder="1-5"
                required
              />
              <TextInput
                label={t("candidates.evaluation.workExperience")}
                type="number"
                min="1"
                max="5"
                value={form.workExperienceScore}
                onChange={(e) => setValue("workExperienceScore", e.target.value)}
                placeholder="1-5"
                required
              />
            </div>
            <p className="text-xs text-gray-500">{t("candidates.evaluation.scoreNote")}</p>
          </div>

          {/* Đánh giá chi tiết */}
          <div className="space-y-4">
            <TextArea
              label={t("candidates.evaluation.strengths")}
              value={form.strengths}
              onChange={(e) => setValue("strengths", e.target.value)}
              rows={3}
              placeholder={t("candidates.evaluation.strengthsPlaceholder")}
              required
            />
            <TextArea
              label={t("candidates.evaluation.weaknesses")}
              value={form.weaknesses}
              onChange={(e) => setValue("weaknesses", e.target.value)}
              rows={3}
              placeholder={t("candidates.evaluation.weaknessesPlaceholder")}
              required
            />
            <RadioOptions
              label={t("candidates.evaluation.conclusion")}
              selectedValue={form.conclusion}
              onChange={(value) => setValue("conclusion", value)}
              options={[
                { value: "true", label: t("candidates.evaluation.pass") },
                { value: "false", label: t("candidates.evaluation.fail") },
              ]}
              required
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex gap-3 justify-end">
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            {t("cancel")}
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? t("submitting") : t("candidates.evaluation.submit")}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
