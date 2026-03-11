import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import Transactions from "./pages/Transactions";
import TransactionDetail from "./pages/TransactionDetail";
import LiveTrade from "./pages/LiveTrade";

function Layout({ children }) {
  return (
    <div className="flex h-screen bg-gray-950 text-white overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-y-auto bg-gray-950 p-8">
        {children}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>

      <Layout>
        <Routes>

          <Route path="/" element={<Dashboard />} />

          <Route path="/upload" element={<Upload />} />

          <Route path="/transactions" element={<Transactions />} />

          <Route
            path="/transactions/:id"
            element={<TransactionDetail />}
          />

          <Route path="/live-trade" element={<LiveTrade />} />

        </Routes>
      </Layout>

    </BrowserRouter>
  );
}