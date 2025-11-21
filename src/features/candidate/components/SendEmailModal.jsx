import { useState } from "react";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import TextInput from "../../../components/ui/TextInput";
import TextArea from "../../../components/ui/TextArea";
import { useSendEmail } from "../../../hooks/useEmail";
import { Mail } from "lucide-react";

export default function SendEmailModal({ isOpen, onClose, recipientEmail, recipientName }) {
  const [subject, setSubject] = useState(`Thư từ công ty - Ứng viên ${recipientName}`);
  const [message, setMessage] = useState("");
  const sendEmail = useSendEmail();

  const handleSend = async () => {
    if (!subject.trim() || !message.trim()) {
      return;
    }

    try {
      await sendEmail.mutateAsync({
        toEmail: recipientEmail,
        subject: subject,
        content: message,
        links: null,
        threadId: null,
        replyToId: null,
        sendViaGmail: true,
      });
      // Reset form
      setSubject(`Thư từ công ty - Ứng viên ${recipientName}`);
      setMessage("");
      onClose();
    } catch (error) {
      // Error is handled by the mutation's onError
      console.error("Failed to send email:", error);
    }
  };

  const handleClose = () => {
    setSubject(`Thư từ công ty - Ứng viên ${recipientName}`);
    setMessage("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Gửi email</h3>
              <p className="text-sm text-gray-600">Gửi đến: {recipientEmail}</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-6 space-y-4">
          <TextInput
            label="Tiêu đề"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Nhập tiêu đề email"
            required
          />

          <TextArea
            label="Nội dung"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Nhập nội dung email..."
            rows={10}
            required
          />
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={sendEmail.isPending}
          >
            Hủy
          </Button>
          <Button
            onClick={handleSend}
            disabled={sendEmail.isPending || !subject.trim() || !message.trim()}
          >
            {sendEmail.isPending ? "Đang gửi..." : "Gửi email"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
