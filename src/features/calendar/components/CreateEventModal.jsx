import { useState, useEffect, useMemo, useCallback } from "react";
import { X, Calendar } from "lucide-react";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import TextInput from "../../../components/ui/TextInput";
import SelectDropdown from "../../../components/ui/SelectDropdown";
import MultiSelectDropdown from "../../../components/ui/MultiSelectDropdown";
import LoadingOverlay from "../../../components/ui/LoadingOverlay";
import { toast } from "react-toastify";
import { useCreateSchedule } from "../hooks/useCalendar";
import { useCandidates } from "../../candidate/hooks/useCandidates";
import { useUsers } from "../../../hooks/useUsers";
import { useTranslation } from "react-i18next";

// moved to components/ui/MultiSelectDropdown.jsx

export default function CreateEventModal({ isOpen, onClose, defaultDate }) {
  const { t } = useTranslation();
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
      name: c.fullName || "",
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
    { id: "INTERVIEW", name: t("calendarSchedule.meetingTypes.interview") },
    { id: "MEETING", name: t("calendarSchedule.meetingTypes.meeting") },
    { id: "TRAINING", name: t("calendarSchedule.meetingTypes.training") },
    { id: "OTHER", name: t("calendarSchedule.meetingTypes.other") },
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
    if (name === "candidate") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        participants: [],
      }));

      if (value) {
        const selectedCandidate = availableCandidates.find((c) => c.id === value);
        setSelectedDepartmentId(selectedCandidate?.departmentId || null);
      } else {
        setSelectedDepartmentId(null);
        setAvailableParticipants([]);
      }
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Load users by department via hook
  const {
    data: usersData,
    isLoading: isLoadingParticipants,
    isError: isUsersError,
    error: usersError,
    refetch: refetchUsers,
  } = useUsers(
    (() => {
      if (!selectedDepartmentId) return {};
      const ids = [1, 2, selectedDepartmentId]
        .map((v) => Number(v))
        .filter((v, i, arr) => !Number.isNaN(v) && arr.indexOf(v) === i);
      return { departmentIds: ids.join(",") };
    })(),
    { enabled: !!selectedDepartmentId }
  );

  // Refetch attendees every time a candidate is selected/changed
  useEffect(() => {
    if (selectedDepartmentId) {
      refetchUsers();
    }
    // We depend on formData.candidate to refetch even if the department is the same
  }, [selectedDepartmentId, formData.candidate, refetchUsers]);

  useEffect(() => {
    if (!formData.candidate) {
      setAvailableParticipants([]);
      return;
    }

    if (isUsersError) {
      const message =
        usersError?.response?.data?.message ||
        "Không thể tải danh sách người tham dự";
      toast.error(message);
      setAvailableParticipants([]);
      return;
    }
    // Normalize response: prefer root `data` array from API payload
    const list = Array.isArray(usersData?.data)
      ? usersData.data
      : Array.isArray(usersData)
      ? usersData
      : Array.isArray(usersData?.data?.result)
      ? usersData.data.result
      : Array.isArray(usersData?.result)
      ? usersData.result
      : undefined;

    if (Array.isArray(list)) {
      setAvailableParticipants(
        list.map((u) => ({
          id: u.id,
          name: (u.employee && (u.employee.name || u.employee.fullName)) || u.name || "",
          role: "",
        }))
      );
    }
  }, [usersData, isUsersError, usersError, formData.candidate]);

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
      toast.error(t("toasts.pleaseEnterEventTitle"));
      return;
    }

    if (!formData.date) {
      toast.error(t("toasts.pleaseSelectDate"));
      return;
    }

    // Check if end time is after start time
    if (formData.endTime <= formData.startTime) {
      toast.error(t("toasts.endTimeAfterStartTime"));
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
                {t("modals.addEventTitle")}
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {t("modals.addEventSubtitle")}
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
                  placeholder={isLoadingCandidates ? t("loading") : t("common.selectCandidate")}
                  required
                />
                {/* Meeting Type */}
                <SelectDropdown
                  label="Loại cuộc họp"
                  options={meetingTypeOptions}
                  value={formData.meetingType}
                  onChange={handleSelectChange("meetingType")}
                  placeholder={t("common.selectMeetingType")}
                  required
                />

                {/* Format */}
                <SelectDropdown
                  label="Hình thức"
                  options={formatOptions}
                  value={formData.format}
                  onChange={handleSelectChange("format")}
                  placeholder={t("common.selectFormat")}
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
                    !formData.candidate
                      ? t("common.selectCandidate") + " trước"
                      : isLoadingParticipants
                      ? t("loading")
                      : availableParticipants.length === 0
                      ? t("common.noParticipants")
                      : t("common.selectParticipants")
                  }
                  disabled={!formData.candidate || isLoadingParticipants}
                />
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* Title */}
                <TextInput
                  label={t("modals.title")}
                  name="title"
                  type="text"
                  placeholder={t("common.exampleTitle")}
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
                  <label className="block text-gray-700">{t("modals.description")}</label>
                  <textarea
                    name="description"
                    placeholder={t("modals.descriptionPlaceholder")}
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
              {t("common.cancel")}
            </Button>
            <Button type="submit" onClick={handleSubmit}>
              {t("modals.createEvent")}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
