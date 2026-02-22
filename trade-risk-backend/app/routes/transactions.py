from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models import Transaction

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/transactions")
def get_transactions(
    risk_level: str = Query(None),
    limit: int = 50,
    offset: int = 0,
    db: Session = Depends(get_db)
):

    query = db.query(Transaction)

    if risk_level:
        query = query.filter(Transaction.risk_level == risk_level)

    results = query.offset(offset).limit(limit).all()

    return results


@router.get("/transactions/{transaction_id}")
def get_transaction_detail(
    transaction_id: int,
    db: Session = Depends(get_db)
):

    transaction = db.query(Transaction).filter(
        Transaction.transaction_id == transaction_id
    ).first()

    return transaction
