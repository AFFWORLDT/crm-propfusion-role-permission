import { BrowserRouter, Routes, Route } from "react-router-dom";
import VehicleReport from "./vehicles/VehicleReport";
import Contacts from "./Contacts";
import GeminiChat from "./GeminiChat";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/vehicles/:vehicleId/report" element={<VehicleReport />} />
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/gemini-chat" element={<GeminiChat />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App; 