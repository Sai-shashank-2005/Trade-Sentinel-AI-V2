from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import pandas as pd

from app.database import SessionLocal
from app.models import Transaction

from app.services.feature_engineering import engineer_features
from app.services.model import compute_ai_score
from app.services.rule_engine import compute_rule_score
from app.services.scoring import compute_hybrid_risk
from app.services.context_layer import apply_context_adjustment
from app.services.explanation_engine import generate_explanations

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/live-trade")
def analyze_live_trade(trade: dict, db: Session = Depends(get_db)):

    df = pd.DataFrame([trade])

    # run intelligence pipeline
    df = engineer_features(df)
    df = compute_ai_score(df)
    df = compute_rule_score(df)
    df = compute_hybrid_risk(df)
    df = apply_context_adjustment(df)

    # risk classification
    risk_levels = []

    for risk in df["final_risk"]:
        if risk >= 75:
            risk_levels.append("High")
        elif risk >= 50:
            risk_levels.append("Medium")
        else:
            risk_levels.append("Low")

    df["final_risk_level"] = risk_levels

    df = generate_explanations(df)

    row = df.iloc[0]

    transaction = Transaction(
        transaction_id=row["transaction_id"],
        raw_risk=row["raw_risk"],
        final_risk=row["final_risk"],
        ai_score=row["ai_score"],
        rule_score=row["rule_score"],
        risk_level=row["final_risk_level"],
        context_adjustment=row["context_adjustment"],
        price_zscore=row["price_zscore"],
        volume_zscore=row["volume_zscore"],
        route_frequency=row["route_frequency"],
        counterparty_frequency=row["counterparty_frequency"],
        price_rule_triggered=row["price_rule_triggered"],
        volume_rule_triggered=row["volume_rule_triggered"],
        route_rule_triggered=row["route_rule_triggered"],
        exporter_rule_triggered=row["exporter_rule_triggered"],
        explanation_text=row["explanation_text"]
    )

    db.add(transaction)
    db.commit()

    return {
        "risk": row["final_risk_level"],
        "score": float(row["final_risk"]),
        "explanation": row["explanation_text"]
    }