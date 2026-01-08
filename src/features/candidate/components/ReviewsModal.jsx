import { useTranslation } from "react-i18next";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import { Star, User } from "lucide-react";

export default function ReviewsModal({ isOpen, onClose, reviews, currentUserId, isHR }) {
  const { t } = useTranslation();

  // Filter reviews based on role
  const displayedReviews = isHR 
    ? reviews 
    : reviews.filter(review => review.reviewerId === currentUserId);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{t("candidates.reviews.title")}</h3>
              <p className="text-sm text-gray-600">
                {displayedReviews.length} {t("candidates.reviews.evaluations")}
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
          {displayedReviews.length === 0 ? (
            <p className="text-center text-gray-500 py-8">{t("candidates.reviews.noReviews")}</p>
          ) : (
            <div className="space-y-4">
              {displayedReviews.map((review, index) => (
                <div key={review.id || index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                  {/* Reviewer Info */}
                  {isHR && (
                    <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">
                        {review.reviewerName || t("candidates.reviews.anonymous")}
                      </span>
                      {review.reviewerPosition && (
                        <span className="text-xs text-gray-500">- {review.reviewerPosition}</span>
                      )}
                      <div className="flex items-center gap-1 ml-3">
                        <Star className="h-4 w-4 text-blue-600 fill-blue-600" />
                        <span className="text-sm font-semibold text-blue-600">
                          {review.averageScore?.toFixed(1)}/5
                        </span>
                      </div>
                      <span className="text-xs text-gray-400 ml-auto">
                        {review.createdAt ? new Date(review.createdAt).toLocaleDateString('vi-VN') : ''}
                      </span>
                    </div>
                  )}

                  {/* Scores */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <div>
                      <p className="text-xs text-gray-500">{t("candidates.evaluation.professionalSkill")}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-semibold text-gray-900">{review.professionalSkillScore}/5</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">{t("candidates.evaluation.communicationSkill")}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-semibold text-gray-900">{review.communicationSkillScore}/5</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">{t("candidates.evaluation.workExperience")}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-semibold text-gray-900">{review.workExperienceScore}/5</span>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  {review.strengths && (
                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-1">{t("candidates.evaluation.strengths")}</p>
                      <p className="text-sm text-gray-600">{review.strengths}</p>
                    </div>
                  )}

                  {review.weaknesses && (
                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-1">{t("candidates.evaluation.weaknesses")}</p>
                      <p className="text-sm text-gray-600">{review.weaknesses}</p>
                    </div>
                  )}

                  {review.conclusion !== null && review.conclusion !== undefined && (
                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-1">{t("candidates.evaluation.conclusion")}</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        review.conclusion 
                          ? "bg-green-100 text-green-700 border border-green-200" 
                          : "bg-red-100 text-red-700 border border-red-200"
                      }`}>
                        {review.conclusion ? t("candidates.evaluation.pass") : t("candidates.evaluation.fail")}
                      </span>
                    </div>
                  )}
                </div>
              ))}

              {/* Overall Summary for HR */}
              {isHR && displayedReviews.length > 1 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-blue-900 mb-3">{t("candidates.reviews.overallSummary")}</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {['professionalSkillScore', 'communicationSkillScore', 'workExperienceScore'].map((field) => {
                        const avg = (displayedReviews.reduce((sum, r) => sum + (r[field] || 0), 0) / displayedReviews.length).toFixed(1);
                        const label = field.replace('Score', '');
                        return (
                          <div key={field}>
                            <p className="text-xs text-blue-700">{t(`candidates.evaluation.${label}`)}</p>
                            <div className="flex items-center gap-1 mt-1">
                              <Star className="h-4 w-4 text-blue-600 fill-blue-600" />
                              <span className="text-sm font-semibold text-blue-900">{avg}/5</span>
                            </div>
                          </div>
                        );
                      })}
                      <div>
                        <p className="text-xs text-blue-700">{t("candidates.reviews.totalAverage")}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="h-4 w-4 text-blue-600 fill-blue-600" />
                          <span className="text-sm font-semibold text-blue-900">
                            {(displayedReviews.reduce((sum, r) => sum + (r.averageScore || 0), 0) / displayedReviews.length).toFixed(1)}/5
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end">
          <Button variant="outline" onClick={onClose}>
            {t("common.close")}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
