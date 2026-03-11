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
  }, [page, riskFilter, search]);

  async function fetchData() {

    try {

      const params = {
        limit,
        offset: (page - 1) * limit,
        search: search || undefined
      };

      if (riskFilter !== "All") {
        params.risk_level = riskFilter;
      }

      const res = await axios.get(`${API}/transactions`, { params });

      setTransactions(res.data);

    } catch (err) {

      console.error("Failed to fetch transactions", err);

    }

  }

  return (

    <div className="space-y-10">

      {/* HEADER */}

      <div className="bg-gray-900 p-8 rounded-2xl shadow-xl">

        <h1 className="text-4xl font-bold tracking-wide">
          Transaction Intelligence Console
        </h1>

        <p className="text-gray-400 mt-2 text-sm">
          Real-time hybrid anomaly detection & contextual risk evaluation
        </p>

      </div>


      {/* SEARCH + PAGINATION */}

      <div className="flex items-center gap-4">

        <input
          type="text"
          placeholder="Search transaction / importer / exporter"
          className="bg-gray-900 border border-gray-800 px-4 py-2 rounded-lg w-96 text-sm"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />

        <select
          className="bg-gray-900 border border-gray-800 px-4 py-2 rounded-lg text-sm"
          value={riskFilter}
          onChange={(e) => {
            setPage(1);
            setRiskFilter(e.target.value);
          }}
        >

          <option>All</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>

        </select>

        {/* PAGINATION BUTTONS */}

        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="bg-gray-900 border border-gray-800 px-3 py-2 rounded-lg"
        >
          ◀
        </button>

        <span className="text-sm text-gray-400">
          Page {page}
        </span>

        <button
          onClick={() => setPage(page + 1)}
          className="bg-gray-900 border border-gray-800 px-3 py-2 rounded-lg"
        >
          ▶
        </button>

      </div>


      {/* TABLE */}

      <div className="bg-gray-900 rounded-2xl shadow-xl overflow-hidden">

        <table className="w-full text-left text-sm">

          <thead className="bg-gray-800 text-gray-400 uppercase tracking-wider text-xs">

            <tr>
              <th className="p-4">Txn ID</th>
              <th>Risk</th>
              <th>Final Risk</th>
              <th>AI Score</th>
              <th>Context Δ</th>
            </tr>

          </thead>

          <tbody>

            {transactions.map((txn) => (

              <tr
                key={txn.id}
                onClick={() => navigate(`/transactions/${txn.id}`)}
                className="border-t border-gray-800 hover:bg-gray-800 cursor-pointer"
              >

                <td className="p-4 font-medium">
                  {txn.transaction_id}
                </td>

                <td>{txn.risk_level}</td>

                <td>{txn.final_risk?.toFixed(2)}</td>

                <td>{txn.ai_score?.toFixed(2)}</td>

                <td>{txn.context_adjustment?.toFixed(2)}</td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}