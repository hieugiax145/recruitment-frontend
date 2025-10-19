import Can from "../../components/Can";
import Button from "../../components/ui/Button";
import ContentHeader from "../../components/ui/ContentHeader";
import {
  Plus,
  Code,
  User,
  Megaphone,
  DollarSign,
  BarChart3,
  Building2,
  FileText,
  Users,
  MoreVertical,
  Search,
  Briefcase,
} from "lucide-react";
import Pagination from "../../components/ui/Pagination";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PositionCard from "./components/PositionCard";

export default function JobPositions() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [positions, setPositions] = useState([
    {
      id: "1",
      jobCode: "ID YCTD: 01",
      title: "Senior Backend Developer",
      department: "Engineering",
      location: "Hybrid",
      type: "full-time",
      level: "senior-level",
      experience: "5+ năm kinh nghiệm",
      salary: "đ 30 - 40 triệu",
      applicants: 1,
      status: "active",
      postedDate: "2025-10-01",
      icon: Code,
      iconBg: "bg-lime-200",
    },
    {
      id: "2",
      jobCode: "ID YCTD: 02",
      title: "Frontend Developer",
      department: "Engineering",
      location: "Remote",
      type: "full-time",
      level: "mid-level",
      experience: "2-4 năm kinh nghiệm",
      salary: "đ 18 - 25 triệu",
      applicants: 4,
      status: "draft",
      postedDate: "2025-10-03",
      iconBg: "bg-purple-200",
    },
    {
      id: "3",
      jobCode: "ID YCTD: 03",
      title: "Product Manager",
      department: "Product",
      location: "Hanoi",
      type: "full-time",
      level: "senior-level",
      experience: "3-5 năm kinh nghiệm",
      salary: "đ 30 - 40 triệu",
      applicants: 4,
      status: "active",
      postedDate: "2025-09-28",
      icon: Briefcase,
      iconBg: "bg-green-300",
    },
    {
      id: "4",
      jobCode: "ID YCTD: 04",
      title: "DevOps Engineer",
      department: "DevOps",
      location: "HCMC",
      type: "full-time",
      level: "mid-level",
      experience: "3-5 năm kinh nghiệm",
      salary: "đ 25 - 35 triệu",
      applicants: 10,
      status: "active",
      postedDate: "2025-09-15",
      icon: Building2,
      iconBg: "bg-blue-200",
    },
    {
      id: "5",
      jobCode: "ID YCTD: 05",
      title: "UI/UX Designer",
      department: "Design",
      location: "Remote",
      type: "full-time",
      level: "mid-level",
      experience: "2-3 năm kinh nghiệm",
      salary: "đ 15 - 22 triệu",
      applicants: 4,
      status: "active",
      postedDate: "2025-10-10",
      icon: FileText,
      iconBg: "bg-purple-200",
    },
    {
      id: "6",
      jobCode: "ID YCTD: 06",
      title: "Mobile Developer",
      department: "Mobile",
      location: "Hanoi",
      type: "full-time",
      level: "mid-level",
      experience: "2-4 năm kinh nghiệm",
      salary: "đ 20 - 28 triệu",
      applicants: 4,
      status: "active",
      postedDate: "2025-09-20",
      icon: Code,
      iconBg: "bg-lime-200",
    },
    {
      id: "7",
      jobCode: "ID YCTD: 07",
      title: "Data Analyst",
      department: "Data",
      location: "HCMC",
      type: "full-time",
      level: "mid-level",
      experience: "1-3 năm kinh nghiệm",
      salary: "đ 18 - 25 triệu",
      applicants: 15,
      status: "active",
      postedDate: "2025-09-18",
      icon: BarChart3,
      iconBg: "bg-blue-200",
    },
    {
      id: "8",
      jobCode: "ID YCTD: 08",
      title: "QA Engineer",
      department: "Quality Assurance",
      location: "Remote",
      type: "full-time",
      level: "entry-level",
      experience: "0-2 năm kinh nghiệm",
      salary: "đ 12 - 18 triệu",
      applicants: 15,
      status: "closed",
      postedDate: "2025-09-01",
      icon: User,
      iconBg: "bg-green-200",
    },
  ]);
  const itemsPerPage = 8;
  const totalPages = Math.ceil(positions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPositions = positions.slice(startIndex, endIndex);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handlePositionClick = (position) => {
    if (selectedPosition?.id === position.id) {
      setSelectedPosition(null);
    } else {
      setSelectedPosition(position);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ContentHeader
        title="Danh sách vị trí tuyển dụng"
        actions={
          <Can allowedRoles={["MANAGER", "ADMIN"]}>
            <Button
              onClick={() => {
                navigate("/job-positions/new");
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Thêm mới
            </Button>
          </Can>
        }
      />
      <div
        className="flex-1 flex flex-col mt-4 overflow-y-auto
        p-6 bg-white rounded-xl shadow"
      >
        {/* <div
          className="
        flex-1
        "
        > */}
        <div className={`${selectedPosition ? "w-[50%]" : "flex-1"}`}>
          <div
            className={
              selectedPosition
                ? `space-y-4`
                : `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3`
            }
          >
            {positions.map((position) => {
              return (
                <PositionCard
                  position={position}
                  selectedPosition={selectedPosition}
                  onClicked={(e) => handlePositionClick(position)}
                  onClickedCandidates={() => {
                    navigate(`/job-positions/${position.id}/candidates`);
                  }}
                />
              );
            })}
          </div>
        </div>
        <div className="flex justify-end items-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
          />
        </div>
        {/* </div> */}
      </div>
    </div>
  );
}
