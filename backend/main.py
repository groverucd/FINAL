from datetime import datetime, timedelta, timezone
from typing import Dict, List, Literal, Optional
from uuid import uuid4

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(title="GoodsFlow / Wellspring Flow API", version="0.1.0")

# Hackathon/demo CORS: allow all frontend origins and methods.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

CATEGORIES = [
    {"name": "hygiene", "display_name": "Hygiene"},
    {"name": "clothing", "display_name": "Clothing"},
    {"name": "baby_supplies", "display_name": "Baby Supplies"},
    {"name": "food", "display_name": "Food"},
    {"name": "household", "display_name": "Household"},
    {"name": "emergency_kits", "display_name": "Emergency Kits"},
]

CATEGORY_DISPLAY = {c["name"]: c["display_name"] for c in CATEGORIES}

inventory_store: Dict[str, Dict[str, int]] = {
    "hygiene": {"quantity": 186, "threshold": 220},
    "clothing": {"quantity": 248, "threshold": 120},
    "baby_supplies": {"quantity": 64, "threshold": 100},
    "food": {"quantity": 172, "threshold": 150},
    "household": {"quantity": 118, "threshold": 90},
    "emergency_kits": {"quantity": 58, "threshold": 80},
}

intake_records: List[dict] = []
outbound_records: List[dict] = []


def category_status(quantity: int, threshold: int) -> Literal["critical", "low", "healthy"]:
    if quantity < threshold * 0.7:
        return "critical"
    if quantity < threshold:
        return "low"
    return "healthy"


def validate_category(category: str) -> None:
    if category not in CATEGORY_DISPLAY:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid category '{category}'. Must be one of: {', '.join(CATEGORY_DISPLAY.keys())}",
        )


def parse_limit(limit: int) -> int:
    if limit < 1:
        raise HTTPException(status_code=400, detail="limit must be >= 1")
    return min(limit, 100)


class IntakeRequest(BaseModel):
    category: str
    item_name: Optional[str] = None
    quantity: int = Field(ge=1)
    condition: Optional[str] = None
    donor_name: Optional[str] = None
    intake_person: str = "Demo User"
    notes: Optional[str] = None


class OutboundRequest(BaseModel):
    category: str
    item_name: Optional[str] = None
    quantity: int = Field(ge=1)
    recipient_id: Optional[str] = None
    outbound_person: str = "Demo User"
    notes: Optional[str] = None


@app.get("/")
def root():
    return {"name": "GoodsFlow / Wellspring Flow API", "status": "ok"}


@app.get("/api/health")
def health():
    return {"status": "healthy", "timestamp": datetime.now(timezone.utc).isoformat()}


@app.get("/api/categories")
def get_categories():
    return CATEGORIES


@app.get("/api/inventory")
def get_inventory():
    return [
        {
            "category": category,
            "display_name": CATEGORY_DISPLAY[category],
            "quantity": values["quantity"],
            "threshold": values["threshold"],
            "status": category_status(values["quantity"], values["threshold"]),
        }
        for category, values in inventory_store.items()
    ]


@app.post("/api/intake")
def create_intake(payload: IntakeRequest):
    validate_category(payload.category)

    item_name = payload.item_name or CATEGORY_DISPLAY[payload.category]
    now = datetime.now(timezone.utc)
    record = {
        "id": str(uuid4()),
        "category": payload.category,
        "display_name": CATEGORY_DISPLAY[payload.category],
        "item_name": item_name,
        "quantity": payload.quantity,
        "condition": payload.condition,
        "donor_name": payload.donor_name,
        "intake_person": payload.intake_person or "Demo User",
        "notes": payload.notes,
        "created_at": now.isoformat(),
    }

    intake_records.append(record)
    inventory_store[payload.category]["quantity"] += payload.quantity
    return record


@app.get("/api/intake")
def list_intake(limit: int = Query(default=10)):
    safe_limit = parse_limit(limit)
    return list(reversed(intake_records))[:safe_limit]


@app.post("/api/outbound")
def create_outbound(payload: OutboundRequest):
    validate_category(payload.category)

    category_inventory = inventory_store[payload.category]
    if payload.quantity > category_inventory["quantity"]:
        raise HTTPException(
            status_code=400,
            detail=(
                f"Insufficient inventory for {payload.category}. "
                f"Requested {payload.quantity}, available {category_inventory['quantity']}."
            ),
        )

    item_name = payload.item_name or CATEGORY_DISPLAY[payload.category]
    now = datetime.now(timezone.utc)
    record = {
        "id": str(uuid4()),
        "category": payload.category,
        "display_name": CATEGORY_DISPLAY[payload.category],
        "item_name": item_name,
        "quantity": payload.quantity,
        "recipient_id": payload.recipient_id,
        "outbound_person": payload.outbound_person or "Demo User",
        "notes": payload.notes,
        "created_at": now.isoformat(),
    }

    outbound_records.append(record)
    category_inventory["quantity"] -= payload.quantity
    return record


@app.get("/api/outbound")
def list_outbound(limit: int = Query(default=10)):
    safe_limit = parse_limit(limit)
    return list(reversed(outbound_records))[:safe_limit]


@app.get("/api/reports/summary")
def reports_summary(days: int = Query(default=7, ge=1)):
    cutoff = datetime.now(timezone.utc) - timedelta(days=days)
    intake_totals = {category: 0 for category in CATEGORY_DISPLAY}
    outbound_totals = {category: 0 for category in CATEGORY_DISPLAY}

    for record in intake_records:
        created_at = datetime.fromisoformat(record["created_at"])
        if created_at >= cutoff:
            intake_totals[record["category"]] += record["quantity"]

    for record in outbound_records:
        created_at = datetime.fromisoformat(record["created_at"])
        if created_at >= cutoff:
            outbound_totals[record["category"]] += record["quantity"]

    return [
        {
            "category": category,
            "display_name": CATEGORY_DISPLAY[category],
            "intake_total": intake_totals[category],
            "outbound_total": outbound_totals[category],
            "net": intake_totals[category] - outbound_totals[category],
        }
        for category in CATEGORY_DISPLAY
    ]


@app.get("/api/reports/low-inventory")
def reports_low_inventory():
    result = []
    for category, values in inventory_store.items():
        quantity = values["quantity"]
        threshold = values["threshold"]
        if quantity < threshold:
            result.append(
                {
                    "category": category,
                    "display_name": CATEGORY_DISPLAY[category],
                    "current_quantity": quantity,
                    "threshold": threshold,
                    "deficit": threshold - quantity,
                    "status": category_status(quantity, threshold),
                }
            )
    return result


@app.get("/api/analytics/shortage-scores")
def analytics_shortage_scores():
    rows = []
    for category, values in inventory_store.items():
        quantity = values["quantity"]
        threshold = values["threshold"]
        deficit = max(0, threshold - quantity)
        if deficit == 0:
            score = 2.0
            days_until_empty = 30
        else:
            score = min(10.0, round((deficit / max(threshold, 1)) * 10 + 5, 1))
            days_until_empty = max(1, round((quantity / max(deficit, 1)) * 7))
        rows.append(
            {
                "category": category,
                "score": score,
                "urgency": category_status(quantity, threshold),
                "deficit_14d": deficit,
                "days_until_empty": days_until_empty,
            }
        )
    rows.sort(key=lambda item: item["score"], reverse=True)
    return rows


@app.get("/api/analytics/recommendations")
def analytics_recommendations():
    recommendations = []
    for row in analytics_shortage_scores():
        if row["urgency"] == "healthy":
            continue
        recommendations.append(
            {
                "category": row["category"],
                "action": (
                    f"Prioritize donation drive for {CATEGORY_DISPLAY[row['category']].lower()} "
                    "in the next outreach cycle."
                ),
                "reason": "Current stock is below threshold relative to demand.",
                "priority": "high" if row["urgency"] == "critical" else "medium",
                "confidence": 0.94 if row["urgency"] == "critical" else 0.86,
            }
        )
    return recommendations


@app.get("/api/analytics/trends")
def analytics_trends(days: int = Query(default=30, ge=1)):
    summary = reports_summary(days=days)
    trends = []
    for item in summary:
        net = item["net"]
        if net > 0:
            trend = "increasing"
        elif net < 0:
            trend = "decreasing"
        else:
            trend = "stable"
        change_pct = round((abs(net) / max(item["outbound_total"], 1)) * 100)
        trends.append(
            {
                "category": item["category"],
                "trend": trend,
                "change_pct": change_pct if net != 0 else 0,
            }
        )
    return trends


@app.get("/api/analytics/weekly-summary")
def analytics_weekly_summary():
    return {
        "summary": (
            "Baby supplies and hygiene kits saw the highest demand this week. "
            "Emergency kits are trending low and should be prioritized in the next donation drive."
        ),
        "ai_powered": False,
        "model": "demo-summary",
    }
