# GoodsFlow / Wellspring Flow Backend (FastAPI)

Hackathon-ready backend API for donation intake, inventory, outbound distribution, and summary reporting.

## Files

- `main.py` - FastAPI app with in-memory data store and all MVP endpoints
- `requirements.txt` - Python dependencies

## Quick Start (Local)

1. Create/activate a virtual environment (optional but recommended):

```bash
python3 -m venv .venv
source .venv/bin/activate
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Run locally:

```bash
uvicorn main:app --reload
```

The API will be available at `http://127.0.0.1:8000`.

## Render Deployment

- **Build command**: `pip install -r requirements.txt`
- **Start command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- **Root directory**: `backend`

## Endpoint List

- `GET /`
- `GET /api/health`
- `GET /api/categories`
- `GET /api/inventory`
- `POST /api/intake`
- `GET /api/intake?limit=10`
- `POST /api/outbound`
- `GET /api/outbound?limit=10`
- `GET /api/reports/summary?days=7`
- `GET /api/reports/low-inventory`
- `GET /api/analytics/recommendations` (optional)
- `GET /api/analytics/trends?days=30` (optional)
- `GET /api/analytics/shortage-scores` (optional)
- `GET /api/analytics/weekly-summary` (optional)

## Curl Tests

```bash
curl http://127.0.0.1:8000/api/health
```

```bash
curl http://127.0.0.1:8000/api/categories
```

```bash
curl http://127.0.0.1:8000/api/inventory
```

```bash
curl -X POST http://127.0.0.1:8000/api/intake \
  -H "Content-Type: application/json" \
  -d '{
    "category": "hygiene",
    "item_name": "Hygiene Kit",
    "quantity": 5,
    "condition": "New",
    "donor_name": "Optional Donor",
    "intake_person": "Demo User",
    "notes": "Drop-off at front desk"
  }'
```

```bash
curl -X POST http://127.0.0.1:8000/api/outbound \
  -H "Content-Type: application/json" \
  -d '{
    "category": "hygiene",
    "item_name": "Hygiene Kit",
    "quantity": 2,
    "recipient_id": "CASE-101",
    "outbound_person": "Demo User",
    "notes": "Anonymous case ID"
  }'
```

```bash
curl "http://127.0.0.1:8000/api/reports/summary?days=7"
```

```bash
curl http://127.0.0.1:8000/api/reports/low-inventory
```

## Notes

- No auth is required for this MVP.
- CORS is configured with `allow_origins=["*"]` and no credentials.
- Data is in-memory for hackathon speed (resets on restart).
