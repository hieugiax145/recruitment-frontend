import { Plus } from "lucide-react";
import Button from "../../components/ui/Button";
import { useEffect, useState } from "react";
import Pagination from "../../components/ui/Pagination";
import RequestCard from "./components/RequestCard";
import RequestStatus from "./components/RequestStatus";
import { Navigate, useNavigate } from "react-router-dom";
import ContentHeader from "../../components/ui/ContentHeader";
import Can from "../../components/Can";
import { reqServices } from "./services/reqServices";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

export default function RecruitmentRequests() {
  const {t}=useTranslation();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRequests, setSelectedRequests] = useState([]);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await reqServices.getRequests();
        if(res.status===200){
          setRequests(res.data.data)
        }
      } catch (e) {
        toast.error(e);
      }
    };

    // fetchRequests();
  }, []);

  const [requests, setRequests] = useState([
    {
      id: "1",
      position: "Senior Backend Developer",
      department: "Engineering",
      requestedBy: "Nguyễn Văn A",
      dateRequested: "2025-10-10",
      status: "approved",
      priority: "high",
    },
    {
      id: "2",
      position: "UI/UX Designer",
      department: "Design",
      requestedBy: "Trần Thị B",
      dateRequested: "2025-10-08",
      status: "pending",
      priority: "medium",
    },
    {
      id: "3",
      position: "Product Manager",
      department: "Product",
      requestedBy: "Lê Văn C",
      dateRequested: "2025-10-05",
      status: "approved",
      priority: "high",
    },
    {
      id: "4",
      position: "DevOps Engineer",
      department: "DevOps",
      requestedBy: "Phạm Thị D",
      dateRequested: "2025-10-03",
      status: "rejected",
      priority: "low",
    },
    {
      id: "5",
      position: "Senior Backend Developer",
      department: "Engineering",
      requestedBy: "Nguyễn Văn A",
      dateRequested: "2025-10-10",
      status: "approved",
      priority: "high",
    },
    {
      id: "6",
      position: "UI/UX Designer",
      department: "Design",
      requestedBy: "Trần Thị B",
      dateRequested: "2025-10-08",
      status: "pending",
      priority: "medium",
    },
    {
      id: "7",
      position: "Product Manager",
      department: "Product",
      requestedBy: "Lê Văn C",
      dateRequested: "2025-10-05",
      status: "approved",
      priority: "high",
    },
    {
      id: "8",
      position: "DevOps Engineer",
      department: "DevOps",
      requestedBy: "Phạm Thị D",
      dateRequested: "2025-10-03",
      status: "rejected",
      priority: "low",
    },
  ]);

  const handleCheckboxChange = (requestId) => {
    setSelectedRequests((prevSelected) => {
      if (prevSelected.includes(requestId)) {
        return prevSelected.filter((id) => id !== requestId);
      }
      return [...prevSelected, requestId];
    });
  };

  const totalPages = Math.ceil(requests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRequests = requests.slice(startIndex, endIndex);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const tableHeaders = (header) => {
    return (
      <>
        <th className="p-4 text-left text-sm font-medium text-gray-600">
          {header}
        </th>
      </>
    );
  };
  return (
    <div className="flex flex-col h-full">
      <ContentHeader
        title={t('listRequest')}
        actions={
          <Can allowedRoles={["MANAGER"]}>
            <Button
              onClick={() => {
                navigate("/recruitment-requests/new");
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Tạo yêu cầu mới
            </Button>
          </Can>
        }
      />
      <div
        className="flex-1 flex flex-col mt-4 overflow-y-auto
        p-6 bg-white rounded-xl shadow"
      >
        <div
          className="
        flex-1
        "
        >
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="bg-red-50">
                <th className="w-12 p-4 sticky ">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300"
                    checked={selectedRequests.length === currentRequests.length}
                    onChange={() => {
                      if (selectedRequests.length === currentRequests.length) {
                        setSelectedRequests([]);
                      } else {
                        setSelectedRequests(currentRequests.map((r) => r.id));
                      }
                    }}
                  />
                </th>
                {tableHeaders("ID")}
                {tableHeaders("Nhân sự lập phiếu")}
                {tableHeaders("Nhân sự phụ trách")}
                {tableHeaders("Vị trí")}
                {tableHeaders("Số lượng")}
                {tableHeaders("Phòng")}
                {tableHeaders("Ngày tạo")}
                {tableHeaders("Trạng thái")}
              </tr>
            </thead>
            <tbody>
              {currentRequests.map((request, index) => (
                <tr
                  key={request.id}
                  className="border-b last:border-b-0 border-gray-200 hover:bg-gray-50 cursor-pointer"
                  onClick={() =>
                    navigate(`/recruitment-requests/${request.id}`)
                  }
                >
                  <td className="p-4" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 bg-white"
                      checked={selectedRequests.includes(request.id)}
                      onChange={() => handleCheckboxChange(request.id)}
                    />
                  </td>
                  <td
                    className="p-4 text-sm"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {startIndex + index + 1}
                  </td>
                  <td className="p-4 text-sm">
                    {request.createdBy?.fullName ||
                      request.creator?.fullName ||
                      "N/A"}
                  </td>
                  <td className="p-4 text-sm">
                    {request.userId?.fullName ||
                      request.requester?.fullName ||
                      "N/A"}
                  </td>
                  <td className="p-4 text-sm">{request.position}</td>
                  <td className="p-4 text-sm">{request.quantity}</td>
                  <td className="p-4 text-sm">{request.department}</td>
                  <td className="p-4 text-sm">
                    {request.createdAt ? "" : "N/A"}
                  </td>
                  <td className="p-4">
                    <RequestStatus status={request.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end items-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
          />
        </div>
      </div>
    </div>
  );
}
