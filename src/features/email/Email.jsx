import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Send, Mail, Star, Inbox, FileText } from "lucide-react";
import ContentHeader from "../../components/ui/ContentHeader";
import TextInput from "../../components/ui/TextInput";
import TextArea from "../../components/ui/TextArea";
import Button from "../../components/ui/Button";
import LoadingContent from "../../components/ui/LoadingContent";
import { useSendEmail } from "../../hooks/useEmail";
import { toast } from "react-toastify";

// Mock data for email list
const mockEmails = [
  {
    id: 1,
    from: "nguyenmanh@gmail.com",
    subject: "Cảm ơn bạn đã phỏng vấn",
    preview: "Kính gửi anh/chị. Cảm ơn anh/chị đã dành thời gian tham gia vào cuộc...",
    date: "2025-10-12",
    starred: true,
  },
  {
    id: 2,
    from: "tranthien@gmail.com",
    subject: "Thích vị trí ứng viên Thiết kế UX",
    preview: "Xin chào, Tôi viết email này để thảo luận về tin tuyển dụng vị...",
    date: "2025-10-11",
    starred: false,
  },
  {
    id: 3,
    from: "phamthuha@gmail.com",
    subject: "Đơn xin tuyển vị trí Sr product mô hình giá cả",
    preview: "Kính gửi các phòng ban tuyển dụng. Tôi rất vui khi gửi đơn ứng v...",
    date: "2025-10-10",
    starred: true,
  },
];

export default function Email() {
  const { t } = useTranslation();
  const formRef = useRef(null);
  const [selectedTab, setSelectedTab] = useState("inbox"); // inbox, sent, drafts
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [form, setForm] = useState({
    toEmail: "",
    subject: "",
    content: "",
  });

  const sendEmail = useSendEmail();

  const onChange = (field) => (e) => {
    const value = e?.target ? e.target.value : e;
    setForm((s) => ({ ...s, [field]: value }));
  };

  const handleSubmit = (e) => {
    e?.preventDefault();

    const requiredFieldsMap = {
      toEmail: t("toEmail", { defaultValue: "Email người nhận" }),
      subject: t("subject", { defaultValue: "Tiêu đề" }),
      content: t("content", { defaultValue: "Nội dung" }),
    };

    for (const [field, label] of Object.entries(requiredFieldsMap)) {
      const value = form[field];
      if (value === null || value === undefined || String(value).trim() === "") {
        toast.error(`${label} ${t("isRequired", { defaultValue: "là bắt buộc" })}`);
        return;
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.toEmail)) {
      toast.error(t("invalidEmail", { defaultValue: "Email không hợp lệ" }));
      return;
    }

    const payload = {
      toEmail: form.toEmail,
      subject: form.subject,
      content: form.content,
      links: null,
      threadId: null,
      replyToId: null,
      sendViaGmail: true,
    };

    sendEmail.mutate(payload, {
      onSuccess: () => {
        setForm({
          toEmail: "",
          subject: "",
          content: "",
        });
      },
    });
  };

  const handleReset = () => {
    setForm({
      toEmail: "",
      subject: "",
      content: "",
    });
  };

  return (
    <div className="flex flex-col h-full">
      <ContentHeader
        title={t("email", { defaultValue: "Email" })}
        actions={
          <Button
            onClick={() => {
              setSelectedTab("inbox");
              setSelectedEmail(null);
            }}
          >
            <Send className="h-4 w-4 mr-2" />
            {t("composeEmail", { defaultValue: "Soạn email" })}
          </Button>
        }
      />

      <div className="flex-1 flex gap-4 mt-4 min-h-0">
        {/* Left Sidebar */}
        <div className="w-80 flex-shrink-0 bg-white rounded-xl shadow overflow-hidden flex flex-col">
          {/* Tabs */}
          <div className="p-3 border-b border-gray-200">
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
              <div
                onClick={() => setSelectedTab("inbox")}
                className={`
                  flex-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer text-center
                  ${
                    selectedTab === "inbox"
                      ? "bg-white text-red-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }
                `}
              >
                {t("inbox", { defaultValue: "Hộp thư" })}
              </div>
              <div
                onClick={() => setSelectedTab("sent")}
                className={`
                  flex-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer text-center
                  ${
                    selectedTab === "sent"
                      ? "bg-white text-red-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }
                `}
              >
                {t("sent", { defaultValue: "Đã gửi" })}
              </div>
              <div
                onClick={() => setSelectedTab("drafts")}
                className={`
                  flex-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer text-center
                  ${
                    selectedTab === "drafts"
                      ? "bg-white text-red-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }
                `}
              >
                {t("drafts", { defaultValue: "Lưu nháp" })}
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <input
                type="text"
                placeholder={t("searchEmail", { defaultValue: "Tìm kiếm email..." })}
                className="w-full px-3 py-2 pl-9 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Email List */}
          <div className="flex-1 overflow-y-auto">
            {mockEmails.map((email) => (
              <div
                key={email.id}
                onClick={() => setSelectedEmail(email)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedEmail?.id === email.id ? "bg-blue-50" : ""
                }`}
              >
                <div className="flex items-start justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">{email.from}</span>
                  {email.starred && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
                </div>
                <p className="text-sm font-medium text-gray-800 mb-1 truncate">
                  {email.subject}
                </p>
                <p className="text-xs text-gray-600 line-clamp-2 mb-1">{email.preview}</p>
                <span className="text-xs text-gray-500">{email.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Content */}
        <div className="flex-1 bg-white rounded-xl shadow overflow-auto">
          {selectedTab === "inbox" && !selectedEmail ? (
            // Compose Email Form
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {t("composeNewEmail", { defaultValue: "Tin nhắn mới" })}
                </h2>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleReset} type="button" disabled={sendEmail.isPending}>
                    {t("reset", { defaultValue: "Đặt lại" })}
                  </Button>
                  <Button onClick={() => formRef.current?.requestSubmit()} disabled={sendEmail.isPending}>
                    <Send className="h-4 w-4 mr-2" />
                    {t("send", { defaultValue: "Gửi" })}
                  </Button>
                </div>
              </div>
              {sendEmail.isPending ? (
                <div className="flex items-center justify-center py-12">
                  <LoadingContent />
                </div>
              ) : (
                <form ref={formRef} onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <TextInput
                      label={t("to", { defaultValue: "Đến" })}
                      type="email"
                      value={form.toEmail}
                      onChange={onChange("toEmail")}
                      required
                      placeholder="recipient@email.com"
                    />

                    <TextInput
                      label={t("subject", { defaultValue: "Tiêu đề" })}
                      type="text"
                      value={form.subject}
                      onChange={onChange("subject")}
                      required
                      placeholder={t("subjectPlaceholder", {
                        defaultValue: "Tiêu đề tin nhắn email",
                      })}
                    />

                    <TextArea
                      label={t("content", { defaultValue: "Nội dung" })}
                      value={form.content}
                      onChange={onChange("content")}
                      rows={12}
                      required
                      placeholder={t("contentPlaceholder", {
                        defaultValue: "Nhập nội dung email...",
                      })}
                    />
                  </div>
                </form>
              )}
            </div>
          ) : selectedEmail ? (
            // Email Detail View
            <div>
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      {selectedEmail.subject}
                    </h2>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="font-medium">{selectedEmail.from}</span>
                      <span>•</span>
                      <span>{selectedEmail.date}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setForm({
                          toEmail: selectedEmail.from,
                          subject: `Re: ${selectedEmail.subject}`,
                          content: "",
                        });
                        setSelectedTab("inbox");
                        setSelectedEmail(null);
                      }}
                    >
                      {t("reply", { defaultValue: "Trả lời" })}
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex-1 p-6 overflow-auto">
                <p className="text-gray-700 whitespace-pre-wrap">{selectedEmail.preview}</p>
              </div>
            </div>
          ) : selectedTab === "compose" ? (
            // Compose Email Form
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {t("composeNewEmail", { defaultValue: "Tin nhắn mới" })}
                </h2>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleReset} type="button" disabled={sendEmail.isPending}>
                    {t("reset", { defaultValue: "Đặt lại" })}
                  </Button>
                  <Button onClick={() => formRef.current?.requestSubmit()} disabled={sendEmail.isPending}>
                    <Send className="h-4 w-4 mr-2" />
                    {t("send", { defaultValue: "Gửi" })}
                  </Button>
                </div>
              </div>
              {sendEmail.isPending ? (
                <div className="flex items-center justify-center py-12">
                  <LoadingContent />
                </div>
              ) : (
                <form ref={formRef} onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t("to", { defaultValue: "Đến" })}
                      </label>
                      <input
                        type="email"
                        value={form.toEmail}
                        onChange={onChange("toEmail")}
                        required
                        placeholder="recipient@email.com"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t("subject", { defaultValue: "Tiêu đề" })}
                      </label>
                      <input
                        type="text"
                        value={form.subject}
                        onChange={onChange("subject")}
                        required
                        placeholder={t("subjectPlaceholder", {
                          defaultValue: "Tiêu đề tin nhắn email",
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t("content", { defaultValue: "Nội dung" })}
                      </label>
                      <textarea
                        value={form.content}
                        onChange={onChange("content")}
                        rows={12}
                        required
                        placeholder={t("contentPlaceholder", {
                          defaultValue: "Nhập nội dung email...",
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      />
                    </div>
                  </div>
                </form>
              )}
            </div>
          ) : (
            // Empty state for other tabs
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p>{t("noEmailsFound", { defaultValue: "Không có email nào" })}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
