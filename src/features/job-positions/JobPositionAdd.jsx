import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { formatNumber, parseFormattedNumber } from "../../utils/utils";
import ContentHeader from "../../components/ui/ContentHeader";
import Button from "../../components/ui/Button";
import TextInput from "../../components/ui/TextInput";
import SelectDropdown from "../../components/ui/SelectDropdown";
import RichTextEditor from "../../components/ui/RichTextEditor";
import {
  useCreateJobPosition,
  useUpdateJobPosition,
  useJobPosition,
} from "./hooks/useJobPositions";
import { useRecruitmentRequests } from "../recruitment-requests/hooks/useRecruitmentRequests";
import LoadingContent from "../../components/ui/LoadingContent";

export default function JobPositionAdd() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    benefits: "",
    salaryMin: 0,
    salaryMax: 0,
    currency: "VND",
    employmentType: "Full-time",
    experienceLevel: "Mid-level",
    location: "",
    isRemote: false,
    yearsOfExperience: "",
    quantity: 1,
    deadline: "",
    recruitmentRequestId: null,
  });

  const {
    data: existingPosition,
    isLoading: positionLoading,
    isError: positionError,
  } = useJobPosition(id);

  const { data: requestsData } = useRecruitmentRequests();
  const allRecruitmentRequests = requestsData?.data?.result || [];
  const recruitmentRequests = allRecruitmentRequests.filter((req) => {
    if (
      isEditMode &&
      existingPosition?.recruitmentRequestId &&
      req.id === existingPosition.recruitmentRequestId
    ) {
      return true;
    }
    return req.status === "APPROVED";
  });

  const createMutation = useCreateJobPosition();
  const updateMutation = useUpdateJobPosition();

  useEffect(() => {
    if (positionError) {
      toast.error("Không thể tải thông tin vị trí tuyển dụng");
    }
  }, [positionError]);

  useEffect(() => {
    if (existingPosition && isEditMode) {
      setFormData({
        title: existingPosition.title || "",
        description: existingPosition.description || "",
        requirements: existingPosition.requirements || "",
        benefits: existingPosition.benefits || "",
        salaryMin: existingPosition.salaryMin || 0,
        salaryMax: existingPosition.salaryMax || 0,
        currency: existingPosition.currency || "VND",
        employmentType: existingPosition.employmentType || "Full-time",
        experienceLevel: existingPosition.experienceLevel || "Mid-level",
        location: existingPosition.location || "",
        isRemote: existingPosition.isRemote || false,
        yearsOfExperience: existingPosition.yearsOfExperience || "",
        quantity: existingPosition.quantity || 1,
        deadline: existingPosition.deadline || "",
        recruitmentRequestId: existingPosition.recruitmentRequestId || null,
      });
    }
  }, [existingPosition, isEditMode]);

  const employmentTypes = [
    { id: "Full-time", name: "Toàn thời gian" },
    { id: "Part-time", name: "Bán thời gian" },
    { id: "Contract", name: "Hợp đồng" },
    { id: "Intern", name: "Thực tập" },
  ];

  const experienceLevels = [
    { id: "Entry-level", name: "Mới vào nghề" },
    { id: "Mid-level", name: "Trung cấp" },
    { id: "Senior-level", name: "Cao cấp" },
    { id: "Lead", name: "Trưởng nhóm" },
    { id: "Manager", name: "Quản lý" },
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleRecruitmentRequestChange = (requestId) => {
    const selectedRequest = recruitmentRequests.find(
      (req) => req.id === requestId
    );

    if (selectedRequest && !isEditMode) {
      setFormData((prev) => ({
        ...prev,
        recruitmentRequestId: requestId,
        title: selectedRequest.title || prev.title,
        description: selectedRequest.description || prev.description,
        requirements: selectedRequest.requirements || prev.requirements,
        benefits: selectedRequest.benefits || prev.benefits,
        salaryMin: selectedRequest.salaryMin || prev.salaryMin,
        salaryMax: selectedRequest.salaryMax || prev.salaryMax,
        location: selectedRequest.location || prev.location,
        quantity: selectedRequest.numberOfPositions || prev.quantity,
      }));

      toast.success("Đã điền thông tin từ yêu cầu tuyển dụng");
    } else {
      setFormData((prev) => ({
        ...prev,
        recruitmentRequestId: requestId,
      }));
    }
  };

  const onSubmit = () => {
    if (!formData.title) {
      toast.error("Vui lòng nhập tên vị trí");
      return;
    }

    if (!formData.recruitmentRequestId) {
      toast.error("Vui lòng chọn yêu cầu tuyển dụng");
      return;
    }

    if (isEditMode) {
      updateMutation.mutate(
        { id, data: formData },
        {
          onSuccess: () => {
            toast.success("Cập nhật thành công");
            navigate(-1);
          },
          onError: (error) => {
            const errorMessage =
              error.response?.data?.message ||
              "Có lỗi xảy ra khi cập nhật vị trí";
            toast.error(errorMessage);
          },
        }
      );
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => {
          navigate(-1);
        },
        onError: (error) => {
          const errorMessage =
            error.response?.data?.message || "Có lỗi xảy ra khi tạo vị trí";
          toast.error(errorMessage);
        },
      });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  if (positionLoading && isEditMode) {
    return (
      <div className="flex flex-col h-full">
        <ContentHeader
          title={
            isEditMode ? "Chỉnh sửa vị trí tuyển dụng" : "Tạo vị trí tuyển dụng"
          }
          actions={
            <>
              <Button onClick={() => onSubmit()} disabled={true}>
                Đang tải...
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate(-1)}
                disabled={true}
              >
                Hủy
              </Button>
            </>
          }
        />
        <div className="flex-1 flex items-center justify-center mt-4">
          <LoadingContent />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <ContentHeader
        title={
          isEditMode ? "Chỉnh sửa vị trí tuyển dụng" : "Tạo vị trí tuyển dụng"
        }
        actions={
          <>
            <Button onClick={() => onSubmit()} disabled={isPending}>
              {isPending
                ? isEditMode
                  ? "Đang cập nhật..."
                  : "Đang lưu..."
                : isEditMode
                ? "Cập nhật"
                : "Lưu vị trí"}
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              disabled={isPending}
            >
              Hủy
            </Button>
          </>
        }
      />

      <div className="flex-1 flex flex-col mt-4 overflow-y-auto p-6 gap-4 bg-white rounded-xl shadow">
        
        <div className="flex flex-col gap-4">
          
          <div className="rounded-md border border-gray-300 p-4 gap-4 flex flex-col">
            <h2>Thông tin cơ bản</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectDropdown
                label="Yêu cầu tuyển dụng"
                name="recruitmentRequestId"
                value={formData.recruitmentRequestId}
                onChange={handleRecruitmentRequestChange}
                options={recruitmentRequests.map((req) => ({
                  id: req.id,
                  name: req.title,
                }))}
                disabled={isPending}
                placeholder="Chọn yêu cầu tuyển dụng"
                required
              />

              <TextInput
                label="Tên vị trí tuyển dụng"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="VD: Senior Backend Developer"
                required
                disabled={isPending}
              />

              <TextInput
                label="Số lượng cần tuyển"
                name="quantity"
                type="text"
                value={formatNumber(formData.quantity)}
                onChange={(e) => {
                  const parsed = parseFormattedNumber(e.target.value);
                  if (parsed !== null || e.target.value === "") {
                    setFormData(prev => ({ ...prev, quantity: parsed || 1 }));
                  }
                }}
                disabled={isPending}
                required
              />

              <SelectDropdown
                label="Loại hình công việc"
                name="employmentType"
                value={formData.employmentType}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, employmentType: value }))
                }
                options={employmentTypes}
                disabled={isPending}
                required
              />

              <SelectDropdown
                label="Cấp độ kinh nghiệm"
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, experienceLevel: value }))
                }
                options={experienceLevels}
                disabled={isPending}
                required
              />

              <TextInput
                label="Số năm kinh nghiệm"
                name="yearsOfExperience"
                value={formData.yearsOfExperience}
                onChange={handleChange}
                placeholder="VD: 1 năm, 2-3 năm..."
                disabled={isPending}
              />

              <TextInput
                label="Địa điểm làm việc"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Hà Nội, Hồ Chí Minh..."
                disabled={isPending}
                required
              />

              <TextInput
                label="Hạn nộp hồ sơ"
                name="deadline"
                type="date"
                value={formData.deadline}
                onChange={handleChange}
                disabled={isPending}
                required
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isRemote"
                name="isRemote"
                checked={formData.isRemote}
                onChange={handleChange}
                disabled={isPending}
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <label htmlFor="isRemote" className="ml-2 text-sm text-gray-700">
                Làm việc từ xa
              </label>
            </div>
          </div>

          
          <div className="rounded-md border border-gray-300 p-4 gap-4 flex flex-col">
            <h2>Thông tin lương thưởng</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextInput
                label="Mức lương tối thiểu (VNĐ)"
                placeholder="0"
                type="text"
                name="salaryMin"
                value={formatNumber(formData.salaryMin)}
                onChange={(e) => {
                  const parsed = parseFormattedNumber(e.target.value);
                  if (parsed !== null || e.target.value === "") {
                    setFormData(prev => ({ ...prev, salaryMin: parsed }));
                  }
                }}
                required
                disabled={isPending}
              />
              <TextInput
                label="Mức lương tối đa (VNĐ)"
                placeholder="0"
                type="text"
                name="salaryMax"
                value={formatNumber(formData.salaryMax)}
                onChange={(e) => {
                  const parsed = parseFormattedNumber(e.target.value);
                  if (parsed !== null || e.target.value === "") {
                    setFormData(prev => ({ ...prev, salaryMax: parsed }));
                  }
                }}
                required
                disabled={isPending}
              />
            </div>
          </div>

          
          <div className="rounded-md border border-gray-300 p-4 gap-4 flex flex-col">
            <h2>Mô tả công việc</h2>
            <div className="gap-4 flex flex-col">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả vị trí
                </label>
                <RichTextEditor
                  value={formData.description}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, description: value }))
                  }
                  placeholder="Nhập mô tả ngắn về vị trí"
                  disabled={isPending}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Yêu cầu công việc
                </label>
                <RichTextEditor
                  value={formData.requirements}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, requirements: value }))
                  }
                  placeholder="Nhập yêu cầu công việc"
                  disabled={isPending}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quyền lợi
                </label>
                <RichTextEditor
                  value={formData.benefits}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, benefits: value }))
                  }
                  placeholder="Nhập quyền lợi"
                  disabled={isPending}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
