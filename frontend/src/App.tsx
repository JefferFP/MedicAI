import { Routes, Route, Navigate } from 'react-router-dom';
import ConsultoraLayout from './consultora/layouts/page';
import ChatbotPage from './consultora/chatbot/page';
import PacientesPage from './consultora/pacientes/page';

function App() {
  return (
    <Routes>
      <Route element={<ConsultoraLayout />}>
        <Route index element={<Navigate to="/chatbot" replace />} />
        <Route path="/chatbot"         element={<ChatbotPage />} />
        <Route path="/pacientes"       element={<PacientesPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/chatbot" replace />} />
    </Routes>
  );
}

export default App;
