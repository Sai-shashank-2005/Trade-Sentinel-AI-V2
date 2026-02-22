# 🚀 Trade Sentinel AI – Backend

AI-powered Trade Risk Intelligence API built with FastAPI.

This backend implements hybrid anomaly detection using:

- Isolation Forest (unsupervised ML)
- Z-Score statistical validation
- Rule-based risk engine
- Context-aware explanation layer

---

# 📂 Project Structure

```
backend-v2/
│
├── app/
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── routes/
│   └── services/
│
├── requirements.txt
├── tests/
└── README.md
```

---

# ⚙️ Requirements

- Python 3.10 or higher
- Git

Check your Python version:

```bash
python3 --version
```

---

# 🛠 Setup Instructions (Linux / Mac / Kali)

## 1️⃣ Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/Trade-Sentinel-AI.git
cd Trade-Sentinel-AI/backend-v2
```

---

## 2️⃣ Create Virtual Environment

```bash
python3 -m venv venv
source venv/bin/activate
```

If activated successfully, you will see:

```
(venv)
```

---

## 3️⃣ Install Dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

---

## 4️⃣ Run Backend Server

```bash
python -m uvicorn app.main:app --reload
```

Server will start at:

```
http://127.0.0.1:8000
```

---

## 📘 API Documentation

Open Swagger UI:

```
http://127.0.0.1:8000/docs
```

---

# 🧪 Run Tests

```bash
pytest
```

---

# 📊 Example Response

```
{
  "total": 50000,
  "high": 230,
  "medium": 3173,
  "low": 46597
}
```

---

# 🔧 Production Run

For production deployment:

```bash
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

---

# ⚠️ Important Notes

- Always run commands from inside `backend-v2/`
- Always activate virtual environment before running
- Never install dependencies globally
- Do not move the `app/` directory

---

# 🧠 Tech Stack

- FastAPI
- SQLAlchemy
- Scikit-learn
- Isolation Forest
- Hybrid Risk Scoring
- Context-Aware Explainability

---

# 👨‍💻 Author

Sai Shashank  
Cybersecurity & AI Engineer
