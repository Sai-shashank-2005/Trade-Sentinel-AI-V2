import { useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export default function LiveTrade() {

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

      alert("Trade analyzed successfully!");

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

      {/* BUTTON */}
      <button
        onClick={submitTrade}
        className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-xl font-semibold"
      >
        {loading ? "Analyzing..." : "Analyze Trade"}
      </button>

      {/* RESULT */}
      {result && (
        <div className="bg-gray-900 p-6 rounded-2xl">

          <h2 className="text-xl font-semibold mb-2">
            Analysis Result
          </h2>

          <p className="text-gray-300">
            Risk Level: <span className="font-bold">{result.risk}</span>
          </p>

        </div>
      )}

    </div>
  );
}