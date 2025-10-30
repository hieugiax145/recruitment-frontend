import { useState } from "react";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";
import Button from "../../components/ui/Button";

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("month"); // day, week, month
  const [selectedDate, setSelectedDate] = useState(null);

  // Helper functions
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const formatDate = (date, format = "full") => {
    const options = {
      full: { weekday: "long", year: "numeric", month: "long", day: "numeric" },
      monthYear: { year: "numeric", month: "long" },
      short: { month: "short", day: "numeric" },
    };
    return date.toLocaleDateString("vi-VN", options[format] || options.full);
  };

  const isToday = (day) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const isSameDate = (day, month = currentDate.getMonth()) => {
    if (!selectedDate) return false;
    return (
      day === selectedDate.getDate() &&
      month === selectedDate.getMonth() &&
      currentDate.getFullYear() === selectedDate.getFullYear()
    );
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handlePrevDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 1);
    setCurrentDate(newDate);
    setSelectedDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 1);
    setCurrentDate(newDate);
    setSelectedDate(newDate);
  };

  const handlePrevWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const handleDateClick = (day, month = currentDate.getMonth()) => {
    const clickedDate = new Date(
      currentDate.getFullYear(),
      month,
      day
    );
    setSelectedDate(clickedDate);

    // If clicking on a day from previous or next month, change the current month
    if (month !== currentDate.getMonth()) {
      setCurrentDate(new Date(currentDate.getFullYear(), month, 1));
    }
  };

  const handleCreateEvent = () => {
    console.log("Create event");
    // TODO: Open modal to create event
  };

  // Render calendar grid
  const renderMonthView = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Get previous month info
    const prevMonth = currentDate.getMonth() - 1;
    const prevMonthDate = new Date(currentDate.getFullYear(), prevMonth, 1);
    const daysInPrevMonth = getDaysInMonth(prevMonthDate);

    // Days from previous month
    for (let i = firstDay - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      const isSelected = isSameDate(day, prevMonth);

      days.push(
        <div
          key={`prev-${day}`}
          onClick={() => handleDateClick(day, prevMonth)}
          className={`
            aspect-square p-2 border cursor-pointer transition-all hover:bg-gray-50
            ${isSelected ? "bg-red-100 border-red-500" : "border-gray-50"}
          `}
        >
          <div className={`text-sm font-medium ${isSelected ? "text-red-700" : "text-gray-400"}`}>
            {day}
          </div>
        </div>
      );
    }

    // Days of the current month
    for (let day = 1; day <= daysInMonth; day++) {
      const isCurrentDay = isToday(day);
      const isSelected = isSameDate(day);

      days.push(
        <div
          key={`current-${day}`}
          onClick={() => handleDateClick(day)}
          className={`
            aspect-square p-2 border border-gray-100 cursor-pointer
            transition-all hover:bg-gray-50
            ${isCurrentDay ? "bg-red-50 border-red-300" : ""}
            ${isSelected ? "bg-red-100 border-red-500" : ""}
          `}
        >
          <div
            className={`
              text-sm font-medium
              ${isCurrentDay ? "text-red-600" : "text-gray-700"}
              ${isSelected ? "text-red-700" : ""}
            `}
          >
            {day}
          </div>
          {/* TODO: Add events here */}
        </div>
      );
    }

    // Days from next month (to fill the grid)
    const totalCells = days.length;
    const remainingCells = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
    const nextMonth = currentDate.getMonth() + 1;

    for (let day = 1; day <= remainingCells; day++) {
      const isSelected = isSameDate(day, nextMonth);

      days.push(
        <div
          key={`next-${day}`}
          onClick={() => handleDateClick(day, nextMonth)}
          className={`
            aspect-square p-2 border cursor-pointer transition-all hover:bg-gray-50
            ${isSelected ? "bg-red-100 border-red-500" : "border-gray-50"}
          `}
        >
          <div className={`text-sm font-medium ${isSelected ? "text-red-700" : "text-gray-400"}`}>
            {day}
          </div>
        </div>
      );
    }

    return days;
  };

  const renderWeekView = () => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);

    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      const dayNum = date.getDate();
      const isCurrentDay = isToday(dayNum);
      const isSelected = selectedDate && 
        date.getDate() === selectedDate.getDate() &&
        date.getMonth() === selectedDate.getMonth() &&
        date.getFullYear() === selectedDate.getFullYear();

      weekDays.push(
        <div
          key={i}
          onClick={() => handleDateClick(date.getDate(), date.getMonth())}
          className={`
            flex-1 border border-gray-100 p-4 cursor-pointer
            transition-all hover:bg-gray-50
            ${isCurrentDay ? "bg-red-50 border-red-300" : ""}
            ${isSelected ? "bg-red-100 border-red-500" : ""}
          `}
        >
          <div className="text-center mb-2">
            <div className="text-xs text-gray-500 mb-1">
              {["CN", "T2", "T3", "T4", "T5", "T6", "T7"][i]}
            </div>
            <div
              className={`
                text-lg font-semibold
                ${isCurrentDay ? "text-red-600" : "text-gray-700"}
                ${isSelected ? "text-red-700" : ""}
              `}
            >
              {dayNum}
            </div>
          </div>
          {/* TODO: Add events here */}
        </div>
      );
    }

    return weekDays;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Main Content */}
      <div className="flex-1 flex gap-4 min-h-0">
        {/* Left Side - Calendar */}
        <div className="flex-1 flex flex-col bg-white rounded-xl shadow overflow-hidden">
          {/* Calendar Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              {/* Current Date Display */}
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-gray-600" />
                <span className="text-lg font-semibold text-gray-900">
                  {formatDate(new Date(), "full")}
                </span>
              </div>

              {/* View Mode Toggle and Create Button */}
              <div className="flex items-center gap-3">
                <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                  <div
                    onClick={() => {
                      setViewMode("day");
                      if (!selectedDate) {
                        setSelectedDate(currentDate);
                      }
                    }}
                    className={`
                      px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer
                      ${
                        viewMode === "day"
                          ? "bg-white text-red-600 shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                      }
                    `}
                  >
                    Ngày
                  </div>
                  <div
                    onClick={() => setViewMode("week")}
                    className={`
                      px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer
                      ${
                        viewMode === "week"
                          ? "bg-white text-red-600 shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                      }
                    `}
                  >
                    Tuần
                  </div>
                  <div
                    onClick={() => setViewMode("month")}
                    className={`
                      px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer
                      ${
                        viewMode === "month"
                          ? "bg-white text-red-600 shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                      }
                    `}
                  >
                    Tháng
                  </div>
                </div>

                {/* Create Button */}
                <Button onClick={handleCreateEvent} className="text-sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Tạo lịch
                </Button>
              </div>
            </div>

            {/* Month/Day/Week Navigation */}
            <div className="flex items-center justify-between">
              <div
                onClick={
                  viewMode === "day"
                    ? handlePrevDay
                    : viewMode === "week"
                    ? handlePrevWeek
                    : handlePrevMonth
                }
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </div>

              <h2 className="text-xl font-semibold text-gray-900">
                {viewMode === "day"
                  ? formatDate(currentDate, "full")
                  : formatDate(currentDate, "monthYear")
                }
              </h2>

              <div
                onClick={
                  viewMode === "day"
                    ? handleNextDay
                    : viewMode === "week"
                    ? handleNextWeek
                    : handleNextMonth
                }
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              >
                <ChevronRight className="h-5 w-5 text-gray-600" />
              </div>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="flex-1 overflow-auto p-4">
            {viewMode === "month" && (
              <div className="h-full">
                {/* Day Headers */}
                <div className="grid grid-cols-7 gap-0 mb-2">
                  {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map((day) => (
                    <div
                      key={day}
                      className="text-center text-sm font-semibold text-gray-600 py-2"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-0 auto-rows-fr">
                  {renderMonthView()}
                </div>
              </div>
            )}

            {viewMode === "week" && (
              <div className="h-full">
                <div className="flex h-full gap-0">
                  {renderWeekView()}
                </div>
              </div>
            )}

            {viewMode === "day" && (
              <div className="text-center text-gray-500 py-20">
                <CalendarIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p>Chế độ xem ngày - Đang phát triển</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Event Details */}
        {selectedDate && viewMode !== "day" && (
          <div className="w-80 bg-white rounded-xl shadow p-6 flex flex-col">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Chi tiết ngày
              </h3>
              <p className="text-sm text-gray-600">
                {formatDate(selectedDate, "full")}
              </p>
            </div>

            <div className="flex-1 overflow-auto">
              {/* TODO: Add events list here */}
              <div className="text-center text-gray-400 py-10">
                <CalendarIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">Chưa có sự kiện nào</p>
              </div>
            </div>

            <Button
              onClick={handleCreateEvent}
              className="mt-4 w-full text-sm"
            >
              Thêm sự kiện
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
