import { useTranslation } from "react-i18next";
import { Star } from "lucide-react";
import TextButton from "../../../components/ui/TextButton";

export default function ReviewsCard({ reviews, onViewDetails }) {
  const { t } = useTranslation();

  const reviewCount = reviews?.length || 0;
  
  // Calculate overall average if there are reviews (3 scores only)
  const overallAverage = reviewCount > 0 
    ? (reviews.reduce((sum, r) => sum + (r.averageScore || 0), 0) / reviewCount).toFixed(1)
    : 0;

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-500" />
          {t("candidates.reviews.title")}
          {reviewCount > 0 && (
            <span className="text-sm font-normal text-gray-500">({reviewCount})</span>
          )}
        </h3>
        {reviewCount > 0 && (
          <TextButton onClick={onViewDetails}>{t("viewAll")}</TextButton>
        )}
      </div>

      {reviewCount === 0 ? (
        <p className="text-sm text-gray-500">{t("candidates.reviews.noReviews")}</p>
      ) : (
        <div className="space-y-4">
          {/* Summary */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-200">
            <div className="flex items-center justify-center">
              <div className="text-center">
                <p className="text-xs text-gray-600 mb-1">{t("candidates.reviews.overallRating")}</p>
                <div className="flex items-center justify-center gap-2">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-5 w-5 ${
                          star <= Math.round(parseFloat(overallAverage))
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-2xl font-bold text-gray-900">{overallAverage}</span>
                  <span className="text-sm text-gray-600">/5</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
