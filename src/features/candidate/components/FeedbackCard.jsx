import { MessageSquare } from "lucide-react";

export default function FeedbackCard({ feedback, notes, rejectionReason }) {
  const hasContent = feedback || notes || rejectionReason;

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <MessageSquare size={18} />
        Nhận xét
      </h3>
      {hasContent ? (
        <div className="space-y-3">
          {feedback && (
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {feedback}
              </p>
            </div>
          )}
          {notes && (
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <p className="text-sm text-gray-600 whitespace-pre-wrap">
                {notes}
              </p>
            </div>
          )}
          {rejectionReason && (
            <div className="bg-red-50 rounded-lg p-3 border border-red-200">
              <div className="text-xs text-red-700 font-medium mb-1">
                Lý do từ chối
              </div>
              <p className="text-sm text-red-800">{rejectionReason}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-6 text-gray-400">
          <MessageSquare size={32} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm">Chưa có nhận xét</p>
        </div>
      )}
    </div>
  );
}
