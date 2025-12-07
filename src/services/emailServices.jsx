import api from "../config/axios";

export const emailServices = {
  sendEmail: async (data) => {
    return await api.post("/communications-service/mail/send/gmail", data);
  },
  getInbox: async () => {
    return await api.get("/communications-service/mail/inbox");
  },
  getSent: async () => {
    return await api.get("/communications-service/mail/sent");
  },
};
