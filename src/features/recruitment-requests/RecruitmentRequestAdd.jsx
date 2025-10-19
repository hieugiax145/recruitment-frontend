import { ChevronRight } from "lucide-react";
import Button from "../../components/ui/Button";
import ContentHeader from "../../components/ui/ContentHeader";
import TextInput from "../../components/ui/TextInput";
import CheckBoxOptions from "../../components/ui/CheckBoxOptions";
import RadioOptions from "../../components/ui/RadioOptions";
import Select from "react-select";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SelectDropdown from "../../components/ui/SelectDropdown";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import { departServices } from "./services/departServices";
import { reqServices } from "./services/reqServices";

export default function RecruitmentRequestAdd() {
  const { id } = useParams();
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    numberOfPositions: 1,
    priorityLevel: "HIGH",
    requestReason: "",
    jobDescription: "",
    requirements: "",
    preferredQualifications: "",
    salaryRangeMin: 0,
    salaryRangeMax: 0,
    currency: "VND",
    employmentType: "FULL_TIME",
    workLocation: "",
    expectedStartDate: "2024-02-01",
    deadline: "2024-01-15",
    jobCategoryId: 1,
    requesterId: 5,
    departmentId: 4,
  });


  const [selectedValues, setSelectedValues] = useState([]);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const getDepartments = async () => {
      const res = await departServices.getDepartments();
      if (res.status === 200) {
        setDepartments(res.data.data);
      }
    };
    getDepartments();
  }, []);

 

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSelectedValues = (value) => {
    setSelectedValues((prev) => {
      if (prev.includes(value)) {
        return prev.filter((v) => v !== value);
      }
      return [...prev, value];
    });
  };

  const locations = [
    {
      id: 1,
      name: "Hà Nội",
    },
    {
      id: 2,
      name: "Hải Phòng",
    },
    {
      id: 3,
      name: "TP. Hồ Chí Minh",
    },
  ];

  const onSubmit = async () => {
    const res = await reqServices.createRequest(formData);
    if (res.status===200) {
        navigate(-1);
      }
  };

  return (
    <div className="flex flex-col h-full">
      <ContentHeader
        title="Thêm yêu cầu tuyển dụng"
        actions={
          <>
            <Button onClick={()=>onSubmit()}>Lưu Yêu Cầu</Button>
            <Button onClick={() => navigate(-1)}>Hủy</Button>
          </>
        }
      />
      <div
        className="flex-1 flex flex-col mt-4 overflow-y-auto
        p-6 gap-4 bg-white rounded-xl shadow"
      >
        {/* progress */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center">
            <span className="text-[#7B61FF] text-sm border-b-2 border-[#7B61FF] pb-1">
              Chờ nộp
            </span>
          </div>
          <ChevronRight className="text-[#E0E0E0]" size={20} />
          <div className="flex items-center">
            <span className="text-[#A3A3A3] text-sm">Đã nộp</span>
          </div>
          <ChevronRight className="text-[#E0E0E0]" size={20} />
          <div className="flex items-center">
            <span className="text-[#A3A3A3] text-sm">Đang duyệt</span>
          </div>
          <ChevronRight className="text-[#E0E0E0]" size={20} />
          <div className="flex items-center">
            <span className="text-[#A3A3A3] text-sm">Đã duyệt</span>
          </div>
          <ChevronRight className="text-[#E0E0E0]" size={20} />
          <div className="flex items-center">
            <span className="text-[#A3A3A3] text-sm">Từ chối</span>
          </div>
        </div>
        {/* form */}
        <div className="flex flex-col gap-4">
          {/* general info */}
          <div className="rounded-md border border-gray-300 p-4 gap-4 flex flex-col">
            <h2>Thông tin chung</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
              <TextInput
                label="Nhân sự lập phiếu"
                placeholder={user.name || "Nhập nhân sự lập phiếu"}
                readOnly={true}
              />

              <SelectDropdown
                label="Phòng"
                placeholder={t("department")}
                options={departments}
              />

              <TextInput
                label="Vị trí tuyển dụng"
                placeholder="Nhập vị trí tuyển dụng"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required={true}
              />
            </div>
          </div>
          {/* recruitment details */}
          <div className="rounded-md border border-gray-300 p-4 gap-4 flex flex-col">
            <h2>Thông tin tuyển dụng</h2>
            <div className="gap-4 flex flex-col">
              <TextInput
                isRow={true}
                label="Số lượng cần tuyển"
                placeholder="Nhập số lượng cần tuyển"
                type="number"
                name="numberOfPositions"
                value={formData.numberOfPositions}
                onChange={handleChange} 
                required={true}
                className={"flex-0"}
              />
              <CheckBoxOptions
                isRow={true}
                label="Nơi làm việc"
                required={true}
                options={locations}
                selectedValues={selectedValues}
                onChange={handleSelectedValues}
              />
              <RadioOptions
                isRow={true}
                label="Lý do tuyển dụng"
                required={true}
                options={[
                  { label: "Thiếu nhân sự", value: "lack_of_personnel" },
                  { label: "Mở rộng quy mô", value: "scale_expansion" },
                ]}
                selectedValue={formData.jobType}
                onChange={(value) => handleChange("jobType", value)}
              />
              <RadioOptions
                isRow={true}
                label="Quỹ tuyển dụng"
                required={true}
                options={[
                  { label: "Đạt chuẩn", value: "male" },
                  { label: "Vượt quỹ", value: "female" },
                ]}
                selectedValue={formData.quota}
                onChange={(value) => handleChange("quota", value)}
              />
            </div>
          </div>
          {/* justification */}
          <div className="rounded-md border border-gray-300 p-4 gap-4 flex flex-col">
            <h2>Mô tả công việc</h2>
            <textarea
              placeholder="Nhập nội dung mô tả công việc"
              className="border border-gray-300 p-2 rounded-md text-gray-700
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              disabled:opacity-50 disabled:cursor-not-allowed
              min-h-[100px] resize-y
              "
              value={formData.jobDescription}
              name="jobDescription"
              onChange={handleChange}
            />
            <textarea
              placeholder="Nhập nội dung yêu cầu ứng viên"
              className="border border-gray-300 p-2 rounded-md text-gray-700
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              disabled:opacity-50 disabled:cursor-not-allowed
              min-h-[100px] resize-y
              "
              value={formData.requirements}
              name="requirements"
              onChange={handleChange}
            />
            <textarea
              placeholder="Nhập nội dung quyền lợi"
              className="border border-gray-300 p-2 rounded-md text-gray-700
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              disabled:opacity-50 disabled:cursor-not-allowed
              min-h-[100px] resize-y
              "
              value={formData.preferredQualifications}
              name="preferredQualifications"
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
