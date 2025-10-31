import { useState, useRef, useEffect, useMemo } from "react";
import { X, Calendar, ChevronDown } from "lucide-react";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import TextInput from "../../../components/ui/TextInput";
import SelectDropdown from "../../../components/ui/SelectDropdown";
import LoadingOverlay from "../../../components/ui/LoadingOverlay";
import { toast } from "react-toastify";
import { useCreateSchedule } from "../hooks/useCalendar";
import { useCandidates } from "../../candidate/hooks/useCandidates";
import { useUsers } from "../../../hooks/useUsers";

// Multi-Select Dropdown Component
function MultiSelectDropdown({
  label,
  options = [],
  selectedValues = [],
  onChange,
  placeholder = "Chọn",
  required = false,
  disabled = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleToggle = (optionId) => {
    if (disabled) return;
    const isSelected = selectedValues.includes(optionId);
    const newValues = isSelected
      ? selectedValues.filter((id) => id !== optionId)
      : [...selectedValues, optionId];
    onChange(newValues);
  };

  const handleRemove = (optionId) => {
    if (disabled) return;
    onChange(selectedValues.filter((id) => id !== optionId));
  };

  const selectedOptions = options.filter((opt) =>
    selectedValues.includes(opt.id)
  );

  return (
    <div className="flex flex-col gap-2">
      <label className="block text-gray-700">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      <div className="relative" ref={dropdownRef}>
        {/* Dropdown Button */}
        <div
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={`border border-gray-300 p-2 rounded-md text-gray-700
            focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent
            cursor-pointer flex items-center justify-between bg-white hover:bg-gray-50 transition-colors
            ${disabled ? "opacity-50 cursor-not-allowed bg-gray-100" : ""}`}
        >
          <span
            className={
              selectedValues.length > 0 ? "text-gray-700" : "text-gray-400"
            }
          >
            {selectedValues.length > 0
              ? `Đã chọn ${selectedValues.length} ${
                  selectedValues.length === 1 ? "người" : "người"
                }`
              : placeholder}
          </span>
          <ChevronDown
            className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>

        {/* Dropdown Menu */}
        {isOpen && !disabled && (
          <ul className="absolute z-50 mt-1 w-full max-h-60 overflow-y-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
            {options.map((option) => (
              <li
                key={option.id}
                onClick={() => handleToggle(option.id)}
                className="relative cursor-pointer select-none px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-3"
              >
                <input
                  type="checkbox"
                  checked={selectedValues.includes(option.id)}
                  onChange={() => {}}
                  className="h-4 w-4 text-red-600 rounded border-gray-300 focus:ring-red-500"
                />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">
                    {option.name}
                  </div>
                  {option.role && (
                    <div className="text-xs text-gray-500">{option.role}</div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Selected Tags */}
        {selectedOptions.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedOptions.map((option) => (
              <div
                key={option.id}
                className="inline-flex items-center gap-1 px-2 py-1 bg-red-50 text-red-700 rounded-md text-xs"
              >
                <span>{option.name}</span>
                {!disabled && (
                  <button
                    type="button"
                    onClick={() => handleRemove(option.id)}
                    className="hover:bg-red-100 rounded-full p-0.5 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function CreateEventModal({ isOpen, onClose, defaultDate }) {
  const createSchedule = useCreateSchedule();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    format: "OFFLINE",
    meetingType: "INTERVIEW",
    status: "SCHEDULED",
    location: "",
    date: defaultDate ? formatDate(defaultDate) : "",
    startTime: "14:00",
    endTime: "15:00",
    reminderTime: 15,
    createdById: 1,
    participants: [],
    candidate: null,
  });

  const [availableParticipants, setAvailableParticipants] = useState([]);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);

  // Load candidates from API (applications list)
  const {
    data: candidateData,
    isLoading: isLoadingCandidates,
    isError: isCandidatesError,
    error: candidatesError,
  } = useCandidates();

  const availableCandidates = useMemo(() => {
    const list = Array.isArray(candidateData?.data?.result)
      ? candidateData.data.result
      : [];
    return list.map((c) => ({
      id: c.id,
      name: `${c.fullName} - ${c.jobPositionTitle || ""}`.trim(),
      departmentId: c.departmentId,
    }));
  }, [candidateData]);

  useEffect(() => {
    if (isCandidatesError) {
      const message =
        candidatesError?.response?.data?.message ||
        "Không thể tải danh sách ứng viên";
      toast.error(message);
    }
  }, [isCandidatesError, candidatesError]);

  const meetingTypeOptions = [
    { id: "INTERVIEW", name: "Phỏng vấn" },
    { id: "MEETING", name: "Họp" },
    { id: "TRAINING", name: "Đào tạo" },
    { id: "OTHER", name: "Khác" },
  ];

  const formatOptions = [
    { id: "ONLINE", name: "Online" },
    { id: "OFFLINE", name: "Offline" },
  ];

  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  // Handle change for TextInput (receives event object)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle change for SelectDropdown (receives value only)
  const handleSelectChange = (name) => (value) => {
    // If selecting candidate, reset participants and load users
    if (name === "candidate") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        participants: [], // Reset participants when candidate changes
      }));

      if (value) {
        const selectedCandidate = availableCandidates.find(
          (c) => c.id === value
        );
        if (selectedCandidate?.departmentId) {
          setSelectedDepartmentId(selectedCandidate.departmentId);
        } else {
          setAvailableParticipants([]);
          setSelectedDepartmentId(null);
        }
      } else {
        setAvailableParticipants([]);
        setSelectedDepartmentId(null);
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Load users by department via hook
  const {
    data: usersData,
    isLoading: isLoadingParticipants,
    isError: isUsersError,
    error: usersError,
  } = useUsers(
    { departmentId: selectedDepartmentId },
    { enabled: !!selectedDepartmentId }
  );

  useEffect(() => {
    if (isUsersError) {
      const message =
        usersError?.response?.data?.message ||
        "Không thể tải danh sách người tham dự";
      toast.error(message);
      setAvailableParticipants([]);
      return;
    }
    const list = Array.isArray(usersData?.data.result)
      ? usersData.data.result
      : usersData?.data?.result;
    if (Array.isArray(list)) {
      setAvailableParticipants(
        list.map((u) => ({
          id: u.id,
          name: u.fullName || u.name || "",
          role: (u.role && (u.role.name || u.role)) || u.position || "",
        }))
      );
    } else if (!selectedDepartmentId) {
      setAvailableParticipants([]);
    }
  }, [usersData, isUsersError, usersError, selectedDepartmentId]);

  // Handle change for MultiSelectDropdown (receives array of values)
  const handleMultiSelectChange = (name) => (values) => {
    setFormData((prev) => ({
      ...prev,
      [name]: values,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      toast.error("Vui lòng nhập tiêu đề sự kiện");
      return;
    }

    if (!formData.date) {
      toast.error("Vui lòng chọn ngày");
      return;
    }

    // Check if end time is after start time
    if (formData.endTime <= formData.startTime) {
      toast.error("Thời gian kết thúc phải sau thời gian bắt đầu");
      return;
    }

    const toIso = (dateStr, timeStr) => {
      const dt = new Date(`${dateStr}T${timeStr}:00`);
      return dt.toISOString();
    };

    const payload = {
      title: formData.title,
      description: formData.description || undefined,
      format: formData.format,
      meetingType: formData.meetingType,
      status: formData.status,
      location: formData.location || undefined,
      startTime: toIso(formData.date, formData.startTime),
      endTime: toIso(formData.date, formData.endTime),
      reminderTime: Number(formData.reminderTime) || 0,
      candidateId: formData.candidate || undefined,
      userIds: formData.participants,
    };

    createSchedule.mutate(payload, {
      onSuccess: () => {
        handleClose();
      },
    });
  };

  const handleClose = () => {
    setFormData({
      title: "",
      description: "",
      format: "OFFLINE",
      meetingType: "INTERVIEW",
      status: "SCHEDULED",
      location: "",
      date: defaultDate ? formatDate(defaultDate) : "",
      startTime: "14:00",
      endTime: "15:00",
      reminderTime: 15,
      createdById: 1,
      participants: [],
      candidate: null,
    });
    setAvailableParticipants([]);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="xl">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-auto max-h-[90vh] flex flex-col">
        {/* Close button */}
        <div
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer z-10"
          aria-label="Close"
        >
          <X className="h-5 w-5 text-gray-500" />
        </div>

        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex gap-3 items-center">
            <div className="flex-shrink-0 w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
              <Calendar className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900">
                Thêm sự kiện
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Tạo sự kiện mới trong lịch làm việc
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="relative flex-1 overflow-y-auto px-6 py-5">
            <LoadingOverlay show={isLoadingParticipants} />
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              {/* Left Column */}
              <div className="space-y-4">
                {/* Candidate */}
                <SelectDropdown
                  label="Ứng viên"
                  options={availableCandidates}
                  value={formData.candidate}
                  onChange={handleSelectChange("candidate")}
                  placeholder={
                    isLoadingCandidates ? "Đang tải..." : "Chọn ứng viên"
                  }
                  required
                />
                {/* Meeting Type */}
                <SelectDropdown
                  label="Loại cuộc họp"
                  options={meetingTypeOptions}
                  value={formData.meetingType}
                  onChange={handleSelectChange("meetingType")}
                  placeholder="Chọn loại cuộc họp"
                  required
                />

                {/* Format */}
                <SelectDropdown
                  label="Hình thức"
                  options={formatOptions}
                  value={formData.format}
                  onChange={handleSelectChange("format")}
                  placeholder="Chọn hình thức"
                />

                {/* Reminder Time */}
                <TextInput
                  label="Nhắc nhở trước (phút)"
                  name="reminderTime"
                  type="number"
                  value={formData.reminderTime}
                  onChange={handleInputChange}
                />

                {/* Participants */}
                <MultiSelectDropdown
                  label="Người tham dự"
                  options={availableParticipants}
                  selectedValues={formData.participants}
                  onChange={handleMultiSelectChange("participants")}
                  placeholder={
                    isLoadingParticipants
                      ? "Đang tải..."
                      : availableParticipants.length === 0 &&
                        !formData.candidate
                      ? "Chọn ứng viên trước"
                      : "Chọn người tham dự"
                  }
                  disabled={
                    isLoadingParticipants ||
                    (!formData.candidate && availableParticipants.length === 0)
                  }
                />
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* Title */}
                <TextInput
                  label="Tiêu đề"
                  name="title"
                  type="text"
                  placeholder="VD: Phỏng vấn ứng viên"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />

                {/* Date, Start Time, End Time - Same Row */}
                <div className="grid grid-cols-3 gap-2">
                  {/* Date */}
                  <TextInput
                    label="Ngày"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                  />

                  {/* Start Time */}
                  <TextInput
                    label="Bắt đầu"
                    name="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    required
                  />

                  {/* End Time */}
                  <TextInput
                    label="Kết thúc"
                    name="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Description */}
                <div className="flex flex-col gap-2">
                  <label className="block text-gray-700">Mô tả</label>
                  <textarea
                    name="description"
                    placeholder="Mô tả chi tiết về sự kiện"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={5}
                    className="border border-gray-300 p-2 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={handleClose}>
              Hủy
            </Button>
            <Button type="submit" onClick={handleSubmit}>
              Tạo sự kiện
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
