import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

export default function LiveTrade() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    transaction_id: "",
    date: "",
    importer: "",
    exporter: "",
    hs_code: "",
    quantity: "",
    unit_price: "",
    origin_country: "",
    destination_country: "",
    route: ""
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [recentTrades, setRecentTrades] = useState([]);

  async function submitTrade() {

    try {

      setLoading(true);

      const payload = {
        ...form,
        transaction_id: Number(form.transaction_id),
        quantity: Number(form.quantity),
        unit_price: Number(form.unit_price)
      };

      const res = await axios.post(`${API}/live-trade`, payload);

      setResult(res.data);

      // add to live feed
      setRecentTrades((prev) => [
        res.data,
        ...prev.slice(0, 4)
      ]);

    } catch (err) {

      console.error(err);
      alert("Trade analysis failed");

    }

    setLoading(false);
  }

  function updateField(field, value) {

    setForm({
      ...form,
      [field]: value
    });

  }

  function riskColor(level) {

    if (level === "High") return "text-red-400";
    if (level === "Medium") return "text-yellow-400";

    return "text-green-400";

  }

  return (

    <div className="space-y-10">

      {/* HEADER */}

      <div className="bg-gray-900 p-8 rounded-2xl shadow-xl">

        <h1 className="text-4xl font-bold">
          Live Trade Intelligence Monitor
        </h1>

        <p className="text-gray-400 mt-2 text-sm">
          Inject a trade and evaluate risk in real-time
        </p>

      </div>


      {/* FORM */}

      <div className="grid grid-cols-2 gap-6 bg-gray-900 p-8 rounded-2xl">

        {Object.keys(form).map((key) => (

          <div key={key} className="space-y-2">

            <label className="text-sm text-gray-400">

              {key.replace("_", " ").toUpperCase()}

            </label>

            <input
              value={form[key]}
              onChange={(e) => updateField(key, e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500"
            />

          </div>

        ))}

      </div>


      {/* ANALYZE BUTTON */}

      <button
        onClick={submitTrade}
        className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-xl font-semibold"
      >

        {loading ? "Analyzing..." : "Analyze Trade"}

      </button>



      {/* RESULT PANEL */}

      {result && (

        <div className="bg-gray-900 p-6 rounded-2xl space-y-6">

          <h2 className="text-xl font-semibold">

            Real-Time Risk Evaluation

          </h2>

          <div className="grid grid-cols-3 gap-6">

            <Metric
              label="Final Risk"
              value={result.final_risk?.toFixed(2)}
              color={riskColor(result.risk_level)}
            />

            <Metric
              label="AI Score"
              value={result.ai_score?.toFixed(2)}
            />

            <Metric
              label="Rule Score"
              value={result.rule_score?.toFixed(2)}
            />

          </div>


          <div>

            <span className={`font-bold text-lg ${riskColor(result.risk_level)}`}>

              {result.risk_level} Risk

            </span>

          </div>


          <button
            onClick={() => navigate(`/transactions/${result.id}`)}
            className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg"
          >

            Open Investigation →

          </button>

        </div>

      )}



      {/* LIVE FEED */}

      {recentTrades.length > 0 && (

        <div className="bg-gray-900 p-6 rounded-2xl">

          <h2 className="text-xl font-semibold mb-4">

            Recent Injected Trades

          </h2>

          <div className="space-y-3">

            {recentTrades.map((t) => (

              <div
                key={t.transaction_id}
                className="flex justify-between bg-gray-800 px-4 py-3 rounded-lg"
              >

                <span>

                  Txn {t.transaction_id}

                </span>

                <span className={riskColor(t.risk_level)}>

                  {t.risk_level}

                </span>

                <span>

                  {t.final_risk?.toFixed(2)}

                </span>

              </div>

            ))}

          </div>

        </div>

      )}

    </div>

  );
}


function Metric({ label, value, color }) {

  return (

    <div>

      <p className="text-xs text-gray-400 uppercase">

        {label}

      </p>

      <p className={`text-2xl font-bold ${color || ""}`}>

        {value}

      </p>

    </div>

  );

}