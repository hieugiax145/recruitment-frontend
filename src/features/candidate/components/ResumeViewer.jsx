import { FileText } from "lucide-react";

export default function ResumeViewer({ resumeUrl }) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <FileText size={18} />
        Hồ sơ ứng tuyển
      </h3>
      {resumeUrl ? (
        <div className="space-y-4">
          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium text-gray-700"
          >
            <FileText size={16} />
            Mở trong tab mới
          </a>
          <div
            className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50"
            style={{ height: "600px" }}
          >
            <iframe src={resumeUrl} className="w-full h-full" title="Resume" />
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
          <FileText size={48} className="mx-auto mb-3 opacity-50" />
          <p className="text-sm">Chưa có hồ sơ đính kèm</p>
        </div>
      )}
    </div>
  );
}
