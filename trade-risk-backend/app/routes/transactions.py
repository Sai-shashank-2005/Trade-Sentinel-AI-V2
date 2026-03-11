from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, cast, String

from app.database import SessionLocal
from app.models import Transaction

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ================= GET TRANSACTIONS =================

@router.get("/transactions")
def get_transactions(
    search: str = Query(None),
    risk_level: str = Query(None),
    limit: int = 50,
    offset: int = 0,
    db: Session = Depends(get_db)
):

    query = db.query(Transaction)

    # GLOBAL SEARCH
    if search:

        term = f"%{search}%"

        query = query.filter(
            or_(
                cast(Transaction.transaction_id, String).ilike(term),
                cast(Transaction.id, String).ilike(term),
                Transaction.importer.ilike(term),
                Transaction.exporter.ilike(term),
                Transaction.route.ilike(term),
                Transaction.origin_country.ilike(term),
                Transaction.destination_country.ilike(term),
            )
        )

    if risk_level:
        query = query.filter(Transaction.risk_level == risk_level)

    query = query.order_by(Transaction.id.desc())

    results = query.offset(offset).limit(limit).all()

    return results


# ================= TRANSACTION DETAIL =================

@router.get("/transactions/{id}")
def get_transaction_detail(
    id: int,
    db: Session = Depends(get_db)
):

    transaction = db.query(Transaction).filter(
        Transaction.id == id
    ).first()

    return transaction