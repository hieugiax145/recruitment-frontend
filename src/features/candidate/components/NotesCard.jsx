export default function NotesCard({ notes }) {
  const hasNotes = !!notes;

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="font-semibold text-gray-900 mb-4">Ghi chú</h3>
      {hasNotes ? (
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{notes}</p>
        </div>
      ) : (
        <div className="text-center py-6 text-gray-400 text-sm">
          Chưa có ghi chú
        </div>
      )}
    </div>
  );
}
