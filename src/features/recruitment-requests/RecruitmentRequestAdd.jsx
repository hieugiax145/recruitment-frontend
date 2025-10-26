import { ChevronRight } from "lucide-react";
import Button from "../../components/ui/Button";
import ContentHeader from "../../components/ui/ContentHeader";
import TextInput from "../../components/ui/TextInput";
import CheckBoxOptions from "../../components/ui/CheckBoxOptions";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SelectDropdown from "../../components/ui/SelectDropdown";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useAllDepartments } from "../../hooks/useDepartments";
import {
  useCreateRecruitmentRequest,
  useUpdateRecruitmentRequest,
  useRecruitmentRequest,
} from "./hooks/useRecruitmentRequests";

export default function RecruitmentRequestAdd() {
  const { id } = useParams();
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isViewMode = !!id;
  const [isEditing, setIsEditing] = useState(false);

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
    requesterId: user?.id || null,
    departmentId: user?.department?.id || null,
  });

  const [selectedValues, setSelectedValues] = useState([]);

  const {
    data: departmentsData,
    isLoading: departmentsLoading,
    isError: departmentsError,
  } = useAllDepartments();

  const {
    data: existingRequest,
    isLoading: requestLoading,
    isError: requestError,
  } = useRecruitmentRequest(id);

  useEffect(() => {
    if (departmentsError) {
      toast.error("Không thể tải danh sách phòng ban");
    }
  }, [departmentsError]);

  useEffect(() => {
    if (requestError) {
      toast.error("Không thể tải thông tin yêu cầu tuyển dụng");
    }
  }, [requestError]);

  useEffect(() => {
    if (existingRequest && isViewMode) {
      const locations = [
        { id: 1, name: "Hà Nội" },
        { id: 2, name: "Hải Phòng" },
        { id: 3, name: "TP. Hồ Chí Minh" },
      ];

      setFormData({
        title: existingRequest.title || "",
        numberOfPositions: existingRequest.numberOfPositions || 1,
        priorityLevel: existingRequest.priorityLevel || "HIGH",
        requestReason: existingRequest.requestReason || "",
        jobDescription: existingRequest.jobDescription || "",
        requirements: existingRequest.requirements || "",
        preferredQualifications: existingRequest.preferredQualifications || "",
        salaryRangeMin: existingRequest.salaryRangeMin || 0,
        salaryRangeMax: existingRequest.salaryRangeMax || 0,
        currency: existingRequest.currency || "VND",
        employmentType: existingRequest.employmentType || "FULL_TIME",
        workLocation: existingRequest.workLocation || "",
        expectedStartDate: existingRequest.expectedStartDate || "",
        deadline: existingRequest.deadline || "",
        jobCategoryId: existingRequest.jobCategoryId || 1,
        requesterId: existingRequest.requesterId || user?.id || null,
        departmentId: existingRequest.departmentId || null,
      });

      if (existingRequest.workLocation) {
        const locationNames = existingRequest.workLocation.split(", ");
        const selectedIds = locations
          .filter((loc) => locationNames.includes(loc.name))
          .map((loc) => loc.id);
        setSelectedValues(selectedIds);
      }
    }
  }, [existingRequest, isViewMode, user]);

  const createMutation = useCreateRecruitmentRequest();
  const updateMutation = useUpdateRecruitmentRequest();

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

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSelectedValues = (value) => {
    setSelectedValues((prev) => {
      const newValues = prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value];

      // Update formData.workLocation with selected location names
      const selectedNames = locations
        .filter((loc) => newValues.includes(loc.id))
        .map((loc) => loc.name)
        .join(", ");

      setFormData((prevData) => ({
        ...prevData,
        workLocation: selectedNames,
      }));

      return newValues;
    });
  };

  const onSubmit = () => {
    if (!formData.title) {
      toast.error("Vui lòng nhập vị trí tuyển dụng");
      return;
    }
    if (!formData.departmentId) {
      toast.error("Vui lòng chọn phòng ban");
      return;
    }
    if (!formData.numberOfPositions || formData.numberOfPositions < 1) {
      toast.error("Số lượng cần tuyển phải lớn hơn 0");
      return;
    }
    if (!formData.requestReason) {
      toast.error("Vui lòng nhập lý do tuyển dụng");
      return;
    }
    if (!formData.salaryRangeMin || formData.salaryRangeMin < 0) {
      toast.error("Vui lòng nhập mức lương tối thiểu");
      return;
    }
    if (!formData.salaryRangeMax || formData.salaryRangeMax < 0) {
      toast.error("Vui lòng nhập mức lương tối đa");
      return;
    }
    if (
      formData.salaryRangeMin &&
      formData.salaryRangeMax &&
      formData.salaryRangeMin > formData.salaryRangeMax
    ) {
      toast.error("Lương tối đa phải lớn hơn lương tối thiểu");
      return;
    }
    if (!formData.expectedStartDate) {
      toast.error("Vui lòng chọn ngày bắt đầu dự kiến");
      return;
    }
    if (!formData.deadline) {
      toast.error("Vui lòng chọn deadline");
      return;
    }

    if (isViewMode && isEditing) {
      updateMutation.mutate(
        { id, data: formData },
        {
          onSuccess: () => {
            setIsEditing(false);
            toast.success("Cập nhật thành công");
          },
          onError: (error) => {
            console.error("Error updating request:", error);
            const errorMessage =
              error.response?.data?.message ||
              "Có lỗi xảy ra khi cập nhật yêu cầu";
            toast.error(errorMessage);
          },
        }
      );
    } else if (!isViewMode) {
      createMutation.mutate(formData, {
        onSuccess: () => {
          navigate(-1);
        },
        onError: (error) => {
          console.error("Error creating request:", error);
          const errorMessage =
            error.response?.data?.message || "Có lỗi xảy ra khi tạo yêu cầu";
          toast.error(errorMessage);
        },
      });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  const isApproved = existingRequest?.status === "APPROVED";
  const canEdit = isViewMode && !isApproved;

  const getCurrentStatus = () => {
    if (!isViewMode) return "DRAFT";
    return existingRequest?.status || "DRAFT";
  };

  const currentStatus = getCurrentStatus();

  const progressSteps = [
    { key: "DRAFT", label: "Chờ nộp" },
    { key: "PENDING", label: "Đang xử lý" },
    { key: "APPROVED", label: "Đã được duyệt" },
    { key: "REJECTED", label: "Từ chối" },
  ];

  const getStepStyle = (stepKey) => {
    if (currentStatus === stepKey) {
      return "text-[#DC2626] text-sm border-b-2 border-[#DC2626] pb-1 font-semibold";
    }
    return "text-[#A3A3A3] text-sm";
  };

  return (
    <div className="flex flex-col h-full">
      <ContentHeader
        title={
          isViewMode ? "Chi tiết yêu cầu tuyển dụng" : "Thêm yêu cầu tuyển dụng"
        }
        actions={
          <>
            {isViewMode && !isEditing && canEdit && (
              <Button onClick={() => setIsEditing(true)}>Sửa</Button>
            )}
            {isViewMode && isEditing && (
              <Button onClick={() => onSubmit()} disabled={isPending}>
                {isPending ? "Đang cập nhật..." : "Cập nhật"}
              </Button>
            )}
            {!isViewMode && (
              <Button onClick={() => onSubmit()} disabled={isPending}>
                {isPending ? "Đang lưu..." : "Lưu Yêu Cầu"}
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => {
                if (isEditing) {
                  setIsEditing(false);
                } else {
                  navigate(-1);
                }
              }}
              disabled={isPending}
            >
              {isEditing ? "Hủy" : isViewMode ? "Đóng" : "Hủy"}
            </Button>
          </>
        }
      />
      <div
        className="flex-1 flex flex-col mt-4 overflow-y-auto
        p-6 gap-4 bg-white rounded-xl shadow"
      >
        {/* progress */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {progressSteps.map((step, index) => (
            <div key={step.key} className="flex items-center">
              <div className="flex items-center">
                <span className={getStepStyle(step.key)}>{step.label}</span>
              </div>
              {index < progressSteps.length - 1 && (
                <ChevronRight className="text-[#E0E0E0] ml-2" size={20} />
              )}
            </div>
          ))}
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
                options={departmentsData || []}
                value={formData.departmentId}
                onChange={(value) => {
                  setFormData((prev) => ({ ...prev, departmentId: value }));
                }}
                required={true}
                disabled={
                  departmentsLoading || isPending || (isViewMode && !isEditing)
                }
              />

              <TextInput
                label="Vị trí tuyển dụng"
                placeholder="Nhập vị trí tuyển dụng"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required={true}
                disabled={isPending || (isViewMode && !isEditing)}
              />

              <SelectDropdown
                label="Mức độ ưu tiên"
                placeholder="Chọn mức độ ưu tiên"
                options={[
                  { id: "HIGH", name: "Cao" },
                  { id: "MEDIUM", name: "Trung bình" },
                  { id: "LOW", name: "Thấp" },
                ]}
                value={formData.priorityLevel}
                onChange={(value) => {
                  setFormData((prev) => ({ ...prev, priorityLevel: value }));
                }}
                required={true}
                disabled={isPending || (isViewMode && !isEditing)}
              />
            </div>
          </div>
          {/* recruitment details */}
          <div className="rounded-md border border-gray-300 p-4 gap-4 flex flex-col">
            <h2>Thông tin tuyển dụng</h2>
            <div className="gap-4 flex flex-col">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextInput
                  label="Số lượng cần tuyển"
                  placeholder="Nhập số lượng cần tuyển"
                  type="number"
                  name="numberOfPositions"
                  value={formData.numberOfPositions}
                  onChange={handleChange}
                  required={true}
                  disabled={isPending || (isViewMode && !isEditing)}
                />
                <SelectDropdown
                  label="Loại hình công việc"
                  placeholder="Chọn loại hình công việc"
                  options={[
                    { id: "FULL_TIME", name: "Full-time" },
                    { id: "PART_TIME", name: "Part-time" },
                    { id: "CONTRACT", name: "Hợp đồng" },
                    { id: "INTERNSHIP", name: "Thực tập" },
                  ]}
                  value={formData.employmentType}
                  onChange={(value) => {
                    setFormData((prev) => ({ ...prev, employmentType: value }));
                  }}
                  required={true}
                  disabled={isPending || (isViewMode && !isEditing)}
                />
              </div>

              <CheckBoxOptions
                isRow={true}
                label="Nơi làm việc"
                required={true}
                options={locations}
                selectedValues={selectedValues}
                onChange={handleSelectedValues}
                disabled={isViewMode && !isEditing}
              />

              <TextInput
                isRow={true}
                label="Lý do tuyển dụng"
                placeholder="Nhập lý do tuyển dụng"
                type="text"
                name="requestReason"
                value={formData.requestReason}
                onChange={handleChange}
                required={true}
                disabled={isPending || (isViewMode && !isEditing)}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextInput
                  label="Lương tối thiểu (VNĐ)"
                  placeholder="0"
                  type="number"
                  name="salaryRangeMin"
                  value={formData.salaryRangeMin}
                  onChange={handleChange}
                  required={true}
                  disabled={isPending || (isViewMode && !isEditing)}
                />
                <TextInput
                  label="Lương tối đa (VNĐ)"
                  placeholder="0"
                  type="number"
                  name="salaryRangeMax"
                  value={formData.salaryRangeMax}
                  onChange={handleChange}
                  required={true}
                  disabled={isPending || (isViewMode && !isEditing)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextInput
                  label="Ngày bắt đầu dự kiến"
                  placeholder="YYYY-MM-DD"
                  type="date"
                  name="expectedStartDate"
                  value={formData.expectedStartDate}
                  onChange={handleChange}
                  required={true}
                  disabled={isPending || (isViewMode && !isEditing)}
                />
                <TextInput
                  label="Deadline"
                  placeholder="YYYY-MM-DD"
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  required={true}
                  disabled={isPending || (isViewMode && !isEditing)}
                />
              </div>
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
              disabled={isPending || (isViewMode && !isEditing)}
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
              disabled={isPending || (isViewMode && !isEditing)}
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
              disabled={isPending || (isViewMode && !isEditing)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
