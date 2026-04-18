import { Routes, Route, Navigate } from 'react-router-dom';
import ConsultoraLayout from './consultora/layouts/page';
import ChatbotPage from './consultora/chatbot/page';
import PacientesPage from './consultora/pacientes/page';
import CalendarioPage from './consultora/calendario/page';
import HistorialTriajePage from './consultora/historialtriaje/page';
import HistorialMedicoPage from './consultora/historialmedico/page';

function App() {
  return (
    <Routes>
      <Route element={<ConsultoraLayout />}>
        <Route index element={<Navigate to="/chatbot" replace />} />
        <Route path="/chatbot"         element={<ChatbotPage />} />
        <Route path="/pacientes"       element={<PacientesPage />} />
        <Route path="/calendario"      element={<CalendarioPage />} />
        <Route path="/historialtriaje" element={<HistorialTriajePage />} />
        <Route path="/historialmedico" element={<HistorialMedicoPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/chatbot" replace />} />
    </Routes>
  );
}

export default App;
