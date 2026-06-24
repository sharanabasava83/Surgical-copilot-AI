import axios from 'axios'

const api = axios.create({
  baseURL: 'https://surgical-copilot-ai-3.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

export default api

// ---- System ----
export const getSystemInfo = () => api.get('/system/info')

// ---- Module catalog ----
export const getModules = () => api.get('/modules')
export const getModule = (key) => api.get(`/modules/${key}`)

// ---- Patients ----
export const getPatients = () => api.get('/patients')
export const getPatient = (id) => api.get(`/patients/${id}`)
export const createPatient = (data) => api.post('/patients', data)
export const updatePatient = (id, data) => api.put(`/patients/${id}`, data)
export const deletePatient = (id) => api.delete(`/patients/${id}`)

// ---- Doctors ----
export const getDoctors = () => api.get('/doctors')
export const createDoctor = (data) => api.post('/doctors', data)
export const deleteDoctor = (id) => api.delete(`/doctors/${id}`)

// ---- Surgeries ----
export const getSurgeries = () => api.get('/surgeries')
export const getSurgeriesByPatient = (patientId) =>
  api.get(`/surgeries/patient/${patientId}`)
export const createSurgery = (data) => api.post('/surgeries', data)
export const recomputePrediction = (id) =>
  api.post(`/surgeries/${id}/recompute-prediction`)
export const deleteSurgery = (id) => api.delete(`/surgeries/${id}`)

// ---- Appointments ----
export const getAppointments = () => api.get('/appointments')
export const createAppointment = (data) => api.post('/appointments', data)
export const deleteAppointment = (id) => api.delete(`/appointments/${id}`)

// ---- Checklist ----
export const getChecklist = (surgeryId) =>
  api.get(`/checklist/surgery/${surgeryId}`)

export const toggleChecklistItem = (id, completedBy) =>
  api.patch(`/checklist/${id}/toggle`, { completedBy })

// ---- Reports ----
export const getReportsByPatient = (patientId) =>
  api.get(`/reports/patient/${patientId}`)

export const uploadReport = (formData) =>
  api.post('/reports/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

// ---- Chatbot ----
export const sendChatMessage = (data) =>
  api.post('/chatbot/message', data)

// ---- Translation ----
export const translateText = (data) =>
  api.post('/translate', data)

// ---- Drug interactions ----
export const checkDrugInteractions = (drugs) =>
  api.post('/drug-interactions/check', { drugs })

// ---- Term simplifier ----
export const simplifyTerms = (text) =>
  api.post('/term-simplifier', { text })

// ---- Recovery ----
export const getRecoveryRecords = (patientId) =>
  api.get(`/recovery-records/patient/${patientId}`)

export const createRecoveryRecord = (data) =>
  api.post('/recovery-records', data)

// ---- Vitals ----
export const getVitals = (patientId) =>
  api.get(`/vitals/patient/${patientId}`)

export const simulateVitalsReading = (patientId) =>
  api.post(`/vitals/patient/${patientId}/simulate-reading`)

// ---- Hospitals ----
export const getHospitals = () => api.get('/hospitals')

// ---- Ambulances ----
export const getAmbulances = () => api.get('/ambulances')

export const advanceAmbulance = (id) =>
  api.post(`/ambulances/${id}/advance`)