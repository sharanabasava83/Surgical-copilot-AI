import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom'
import { ModuleProvider } from './context/ModuleContext'
import Layout from './components/Layout'

import Dashboard from './pages/Dashboard'
import SimulatedModulePage from './pages/SimulatedModulePage'

import PatientManagement from './pages/PatientManagement'
import PatientDetail from './pages/PatientDetail'
import ImageAnalysis from './pages/ImageAnalysis'
import MedicalChatbot from './pages/MedicalChatbot'
import TranslationEngine from './pages/TranslationEngine'
import SurgeryScheduling from './pages/SurgeryScheduling'
import RecoveryTracker from './pages/RecoveryTracker'
import RemoteMonitoring from './pages/RemoteMonitoring'
import HospitalMapping from './pages/HospitalMapping'
import AmbulanceTracking from './pages/AmbulanceTracking'
import DrugInteractionChecker from './pages/DrugInteractionChecker'
import TermSimplifier from './pages/TermSimplifier'
import ChecklistAutomation from './pages/ChecklistAutomation'
import SuccessPrediction from './pages/SuccessPrediction'
import BloodLossPrediction from './pages/BloodLossPrediction'
import ChatTranslation from './pages/ChatTranslation'
import WearableIntegration from './pages/WearableIntegration'

// New batch - 19 additional modules
import VoiceControlledAssistant from './pages/VoiceControlledAssistant'
import DecisionSupport from './pages/DecisionSupport'
import OrganVisualization3D from './pages/OrganVisualization3D'
import ARSurgeryGuidance from './pages/ARSurgeryGuidance'
import SimilarCaseRecommendation from './pages/SimilarCaseRecommendation'
import DiagnosisAssistant from './pages/DiagnosisAssistant'
import ReportExplanationEngine from './pages/ReportExplanationEngine'
import VoiceToVoiceTranslation from './pages/VoiceToVoiceTranslation'
import MultilingualChatbot from './pages/MultilingualChatbot'
import SurgeryTeamTranslator from './pages/SurgeryTeamTranslator'
import HospitalCollaboration from './pages/HospitalCollaboration'
import CaseSharing from './pages/CaseSharing'
import ExpertConsultation from './pages/ExpertConsultation'
import EmergencyDetection from './pages/EmergencyDetection'
import MedicalResearchHub from './pages/MedicalResearchHub'
import AnatomyExplorer from './pages/AnatomyExplorer'
import SpeechToText from './pages/SpeechToText'
import TextToSpeech from './pages/TextToSpeech'

function MultiHospitalCollaborationPage() {
  return (
    <HospitalCollaboration
      filterType=""
      pageTitle="Multi-Hospital Collaboration"
      pageDesc="Shared discussion and case workspace across hospitals."
    />
  )
}

// Module keys that have a fully-built "live demo" page.
// Everything else in the catalog renders through SimulatedModulePage.
const LIVE_ROUTES = {
  'patient-management': PatientManagement,
  'image-analysis': ImageAnalysis,
  'medical-chatbot': MedicalChatbot,
  'translation-engine': TranslationEngine,
  'surgery-scheduling': SurgeryScheduling,
  'recovery-tracker': RecoveryTracker,
  'remote-monitoring': RemoteMonitoring,
  'hospital-mapping': HospitalMapping,
  'ambulance-tracking': AmbulanceTracking,
  'drug-interaction': DrugInteractionChecker,
  'term-simplifier': TermSimplifier,
  'checklist-automation': ChecklistAutomation,
  'success-prediction': SuccessPrediction,
  'blood-loss-prediction': BloodLossPrediction,
  'chat-translation': ChatTranslation,
  'wearable-integration': WearableIntegration,
  'voice-assistant': VoiceControlledAssistant,
  'decision-support': DecisionSupport,
  'organ-3d': OrganVisualization3D,
  'ar-guidance': ARSurgeryGuidance,
  'similar-case': SimilarCaseRecommendation,
  'diagnosis-assistant': DiagnosisAssistant,
  'report-explanation': ReportExplanationEngine,
  'voice-translation': VoiceToVoiceTranslation,
  'multilingual-chatbot': MultilingualChatbot,
  'team-translator': SurgeryTeamTranslator,
  'hospital-collaboration': MultiHospitalCollaborationPage,
  'case-sharing': CaseSharing,
  'expert-consultation': ExpertConsultation,
  'emergency-detection': EmergencyDetection,
  'research-hub': MedicalResearchHub,
  'knowledge-engine': MedicalResearchHub,
  'anatomy-explorer': AnatomyExplorer,
  'speech-to-text': SpeechToText,
  'text-to-speech': TextToSpeech,
}

function ModuleRouteWrapper() {
  const { moduleKey } = useParams()
  const Page = LIVE_ROUTES[moduleKey]
  if (Page) return <Page />
  return <SimulatedModulePage moduleKey={moduleKey} />
}

export default function App() {
  return (
    <ModuleProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/patients/:id" element={<PatientDetail />} />
            <Route path="/module/:moduleKey" element={<ModuleRouteWrapper />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ModuleProvider>
  )
}
