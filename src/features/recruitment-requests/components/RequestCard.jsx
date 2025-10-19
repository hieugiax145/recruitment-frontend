export default function RequestCard({ request }) {
    const getStatusColor = (status) => {
        switch (status) {
            case 'approved':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className={`p-4 rounded-lg shadow ${getStatusColor(request.status)}`}>
            <h4 className="font-semibold">{request.position}</h4>
            <p>{request.department}</p>
            <p>{request.requestedBy}</p>
            <p>{request.dateRequested}</p>
        </div>
    );
}