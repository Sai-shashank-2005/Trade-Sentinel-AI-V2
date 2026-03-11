import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const API = import.meta.env.VITE_API_URL;

export default function Dashboard() {
  const navigate = useNavigate();

  const [summary, setSummary] = useState(null);
  const [topRisk, setTopRisk] = useState([]);
  const [routeRisk, setRouteRisk] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [riskIndex, setRiskIndex] = useState(0);

  useEffect(() => {
    fetchSummary();
    fetchTransactions();
  }, []);

  async function fetchSummary() {
    const res = await axios.get(`${API}/dashboard-summary`);
    setSummary(res.data);
  }

  async function fetchTransactions() {
    const res = await axios.get(`${API}/transactions?limit=500`);
    const txns = res.data;

    /* GLOBAL RISK INDEX */
    const avg =
      txns.reduce((sum, t) => sum + t.final_risk, 0) / txns.length;

    setRiskIndex(avg.toFixed(1));

    /* ROUTE RISK INTELLIGENCE */

    const routeMap = {};

    txns.forEach((t) => {
      const r = t.route;

      if (!routeMap[r]) {
        routeMap[r] = { route: r, total: 0, count: 0 };
      }

      routeMap[r].total += t.final_risk;
      routeMap[r].count++;
    });

    const routeData = Object.values(routeMap)
      .map((r) => ({
        route: r.route,
        risk: r.total / r.count,
      }))
      .sort((a, b) => b.risk - a.risk)
      .slice(0, 8);

    setRouteRisk(routeData);

    /* ALERT FEED */

    const highAlerts = txns
      .filter((t) => t.risk_level === "High")
      .slice(0, 5);

    setAlerts(highAlerts);

    /* TOP RISK */

    const top = txns
      .sort((a, b) => b.final_risk - a.final_risk)
      .slice(0, 10);

    setTopRisk(top);
  }

  if (!summary)
    return <div className="text-gray-400">Loading dashboard...</div>;

  const highPercent = ((summary.high / summary.total) * 100).toFixed(2);

  return (
    <div className="space-y-10">

      {/* HEADER */}

      <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-8 rounded-2xl shadow-xl">
        <h1 className="text-4xl font-bold">
          Global Trade Risk Intelligence
        </h1>

        <p className="text-gray-400 text-sm mt-2">
          AI-driven anomaly detection monitoring international trade flows
        </p>
      </div>


      {/* GLOBAL RISK INDEX */}

      <div className="bg-gray-900 p-6 rounded-2xl shadow-lg flex justify-between">

        <div>
          <p className="text-xs text-gray-400 uppercase">
            Global Risk Index
          </p>

          <p className="text-4xl font-bold text-blue-400 mt-2">
            {riskIndex}
          </p>

          <p className="text-gray-400 text-sm">
            Aggregated intelligence from recent trade flows
          </p>
        </div>

        <div className="text-right text-sm text-gray-500">
          Hybrid AI + Rule + Context scoring
        </div>
      </div>


      {/* KPI GRID */}

      <div className="grid grid-cols-4 gap-6">

        <KPI label="Total Transactions" value={summary.total} />

        <KPI
          label="High Risk"
          value={summary.high}
          sub={`${highPercent}% flagged`}
          color="text-red-400"
        />

        <KPI
          label="Medium Risk"
          value={summary.medium}
          color="text-yellow-400"
        />

        <KPI
          label="Low Risk"
          value={summary.low}
          color="text-green-400"
        />

      </div>


      {/* RISK EXPOSURE + ROUTE RISK */}

      <div className="grid grid-cols-2 gap-6">

        {/* RISK EXPOSURE */}

        <div className="bg-gray-900 p-6 rounded-2xl shadow-lg">

          <h2 className="text-lg font-semibold mb-4">
            Risk Exposure
          </h2>

          <div className="space-y-4">

            <Exposure
              label="High Risk Investigations"
              value={summary.high}
              color="text-red-400"
            />

            <Exposure
              label="Medium Risk Monitoring"
              value={summary.medium}
              color="text-yellow-400"
            />

            <Exposure
              label="Safe Trade Volume"
              value={summary.low}
              color="text-green-400"
            />

          </div>
        </div>


        {/* ROUTE HEATMAP */}

        <div className="bg-gray-900 p-6 rounded-2xl shadow-lg">

          <h2 className="text-lg font-semibold mb-4">
            Risk Concentration by Trade Route
          </h2>

          <div className="h-80">

            <ResponsiveContainer>

              <BarChart data={routeRisk}>

                <CartesianGrid strokeDasharray="3 3" stroke="#333" />

                <XAxis dataKey="route" stroke="#aaa" />

                <YAxis stroke="#aaa" />

                <Tooltip />

                <Bar dataKey="risk" fill="#3b82f6" />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>

      </div>


      {/* ALERT FEED */}

      <div className="bg-gray-900 p-6 rounded-2xl shadow-lg">

        <h2 className="text-lg font-semibold mb-4">
          🚨 Active Risk Alerts
        </h2>

        {alerts.length === 0 && (
          <p className="text-gray-400 text-sm">
            No high-risk anomalies detected recently
          </p>
        )}

        {alerts.map((a) => (

          <div
            key={a.id}
            onClick={() => navigate(`/transactions/${a.id}`)}
            className="flex justify-between border-b border-gray-800 py-2 cursor-pointer hover:text-white"
          >

            <span>Txn {a.transaction_id}</span>

            <span className="text-red-400">
              {a.final_risk.toFixed(2)}
            </span>

          </div>

        ))}

      </div>


      {/* TOP HIGH RISK */}

      <div className="bg-gray-900 p-6 rounded-2xl shadow-lg">

        <h2 className="text-lg font-semibold mb-4">
          🔥 Top High Risk Transactions
        </h2>

        <table className="w-full text-left">

          <thead className="bg-gray-800 text-sm">

            <tr>
              <th className="p-3">Txn ID</th>
              <th>Final Risk</th>
              <th>AI Score</th>
              <th>Context Impact</th>
            </tr>

          </thead>

          <tbody>

            {topRisk.map((txn) => (

              <tr
                key={txn.id}
                onClick={() => navigate(`/transactions/${txn.id}`)}
                className="border-t border-gray-800 hover:bg-gray-800 cursor-pointer"
              >

                <td className="p-3">{txn.transaction_id}</td>

                <td className="text-red-400 font-semibold">
                  {txn.final_risk.toFixed(2)}
                </td>

                <td>{txn.ai_score.toFixed(2)}</td>

                <td>{txn.context_adjustment.toFixed(2)}</td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}


function KPI({ label, value, color, sub }) {
  return (
    <div className="bg-gray-900 p-6 rounded-2xl shadow-lg">
      <p className="text-xs text-gray-400 uppercase">{label}</p>
      <p className={`text-2xl font-bold mt-2 ${color || ""}`}>
        {value}
      </p>
      {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
    </div>
  );
}

function Exposure({ label, value, color }) {
  return (
    <div className="flex justify-between border-b border-gray-800 pb-2">
      <span>{label}</span>
      <span className={`font-semibold ${color}`}>{value}</span>
    </div>
  );
}