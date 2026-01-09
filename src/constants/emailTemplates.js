export const EMAIL_TEMPLATES = {
  INTERVIEW_INVITATION: {
    id: "INTERVIEW_INVITATION",
    name: "Thư mời phỏng vấn",
    subject: (name) => `Thư mời phỏng vấn - ${name}`,
    content: (name) => `Kính gửi ${name},

Chúng tôi rất vui mừng thông báo rằng hồ sơ ứng tuyển của bạn đã được chọn để tham gia vòng phỏng vấn.

Thông tin buổi phỏng vấn:
- Ngày giờ: [Ngày giờ cụ thể]
- Địa điểm: [Địa chỉ công ty]
- Hình thức: Phỏng vấn trực tiếp/Online
- Thời gian dự kiến: [Thời gian]

Vui lòng xác nhận tham dự và chuẩn bị các tài liệu liên quan.

Trân trọng,
MelodySoft`
  },
  THANK_YOU: {
    id: "THANK_YOU",
    name: "Thư cảm ơn",
    subject: (name) => `Cảm ơn bạn đã tham gia phỏng vấn - ${name}`,
    content: (name) => `Kính gửi ${name},

Chúng tôi xin chân thành cảm ơn bạn đã dành thời gian tham gia buổi phỏng vấn tại công ty.

Chúng tôi rất ấn tượng với trình độ chuyên môn và kinh nghiệm của bạn. Hiện tại, chúng tôi đang trong quá trình xem xét và sẽ thông báo kết quả sớm nhất có thể.

Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ với chúng tôi.

Trân trọng,
MelodySoft`
  },
  JOB_OFFER: {
    id: "JOB_OFFER",
    name: "Thư mời nhận việc",
    subject: (name) => `Thư mời nhận việc - ${name}`,
    content: (name) => `Kính gửi ${name},

Chúng tôi rất vui mừng thông báo rằng bạn đã được chọn cho vị trí [Tên vị trí] tại công ty.

Thông tin công việc:
- Vị trí: [Tên vị trí]
- Phòng ban: [Tên phòng ban]
- Mức lương: [Mức lương]
- Ngày bắt đầu: [Ngày bắt đầu]
- Địa điểm làm việc: [Địa chỉ]

Vui lòng xác nhận việc nhận lời mời này trong vòng [số ngày] ngày làm việc.

Chúng tôi rất mong được chào đón bạn gia nhập đội ngũ của chúng tôi.

Trân trọng,
MelodySoft`
  }
};
