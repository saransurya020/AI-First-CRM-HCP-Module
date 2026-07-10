import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export const createInteraction = (data) => apiClient.post("/interactions/", data);
export const listInteractions = () => apiClient.get("/interactions/");
export const getInteraction = (id) => apiClient.get(`/interactions/${id}`);
export const updateInteraction = (id, data) => apiClient.put(`/interactions/${id}`, data);
export const deleteInteraction = (id) => apiClient.delete(`/interactions/${id}`);

export const sendChatMessage = (message, sessionId = "default", repId = null) =>
  apiClient.post("/chat/", { message, session_id: sessionId, rep_id: repId });

export default apiClient;
