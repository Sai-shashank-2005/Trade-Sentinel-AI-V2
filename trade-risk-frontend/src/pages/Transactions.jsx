import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");
  const [page, setPage] = useState(1);

  const navigate = useNavigate();
  const limit = 50;

  useEffect(() => {
    fetchData();
  }, [page, riskFilter]);

  async function fetchData() {
    try {
      const params = {
        limit,
        offset: (page - 1) * limit,
      };

      if (riskFilter !== "All") {
        params.risk_level = riskFilter;
      }

      const res = await axios.get(`${API}/transactions`, { params });
      setTransactions(res.data);
    } catch (err) {
      console.error("Failed to fetch transactions");
    }
  }

  const filtered = transactions.filter((t) =>
    t.transaction_id.toString().includes(search)
  );

  const highCount = filtered.filter(t => t.risk_level === "High").length;
  const mediumCount = filtered.filter(t => t.risk_level === "Medium").length;
  const lowCount = filtered.filter(t => t.risk_level === "Low").length;

  return (
    <div className="space-y-10">

      {/* ================= EXECUTIVE HEADER ================= */}
       <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-8 rounded-2xl shadow-xl">
        <h1 className="text-4xl font-bold tracking-wide">
        Transaction Intelligence Console
        </h1>
        <p className="text-gray-400 mt-2 text-sm">
          Real-time hybrid anomaly detection & contextual risk evaluation
        </p>
      </div>

      {/* ================= LIVE SNAPSHOT ================= */}
      <div className="grid grid-cols-3 gap-6">

        <Snapshot label="High Risk" value={highCount} color="red" />
        <Snapshot label="Medium Risk" value={mediumCount} color="yellow" />
        <Snapshot label="Low Risk" value={lowCount} color="green" />

      </div>

      {/* ================= CONTROLS ================= */}
      <div className="flex flex-wrap gap-4 items-center">

        <input
          type="text"
          placeholder="Search by Transaction ID..."
          className="bg-gray-900 border border-gray-800 px-4 py-2 rounded-lg w-72 text-sm focus:outline-none focus:border-blue-500 transition"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="bg-gray-900 border border-gray-800 px-4 py-2 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition"
          value={riskFilter}
          onChange={(e) => setRiskFilter(e.target.value)}
        >
          <option>All</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>

        <div className="text-xs text-gray-500">
          Showing {filtered.length} records (Page {page})
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-gray-900 rounded-2xl shadow-xl overflow-hidden">

        <table className="w-full text-left text-sm">
          <thead className="bg-gray-800 text-gray-400 uppercase tracking-wider text-xs">
            <tr>
              <th className="p-4">Txn ID</th>
              <th>Risk</th>
              <th>Final Risk</th>
              <th>AI Score</th>
              <th>Context Δ</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((txn) => (
              <tr
                key={txn.transaction_id}
                onClick={() =>
                  navigate(`/transactions/${txn.transaction_id}`)
                }
                className="border-t border-gray-800 hover:bg-gray-800 cursor-pointer transition"
              >
                <td className="p-4 font-medium">
                  {txn.transaction_id}
                </td>

                <td>{riskBadge(txn.risk_level)}</td>

                <td className="font-semibold">
                  {txn.final_risk.toFixed(2)}
                </td>

                <td>{txn.ai_score.toFixed(2)}</td>

                <td
                  className={
                    txn.context_adjustment < 0
                      ? "text-green-400"
                      : "text-red-400"
                  }
                >
                  {txn.context_adjustment.toFixed(2)}
                </td>

                <td className="text-blue-400 text-xs">
                  View →
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= PAGINATION ================= */}
      <div className="flex justify-between items-center text-sm">

        <button
          className="bg-gray-900 border border-gray-800 px-4 py-2 rounded-lg disabled:opacity-40 hover:border-blue-500 transition"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          ← Previous
        </button>

        <button
          className="bg-gray-900 border border-gray-800 px-4 py-2 rounded-lg hover:border-blue-500 transition"
          onClick={() => setPage(page + 1)}
        >
          Next →
        </button>
      </div>

    </div>
  );
}

/* ================= COMPONENTS ================= */

function Snapshot({ label, value, color }) {
  const textColor =
    color === "red"
      ? "text-red-400"
      : color === "yellow"
      ? "text-yellow-400"
      : "text-green-400";

  return (
    <div className="bg-gray-900 p-6 rounded-2xl">
      <p className="text-gray-400 text-sm">{label}</p>
      <p className={`text-2xl font-bold mt-2 ${textColor}`}>
        {value}
      </p>
    </div>
  );
}

function riskBadge(level) {
  if (level === "High")
    return (
      <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-xs font-medium">
        High
      </span>
    );

  if (level === "Medium")
    return (
      <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-xs font-medium">
        Medium
      </span>
    );

  return (
    <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-medium">
      Low
    </span>
  );
}