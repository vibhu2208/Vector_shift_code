# 🚀 VectorShift Full Stack Assessment – React + FastAPI

This project is a full-stack visual pipeline editor built using **React** (frontend) and **FastAPI** (backend). The tool allows users to create node-based pipelines with drag-and-drop functionality, export/import options, and backend validation for DAG structure.

---

## 🌐 Live Demo

> 🎯 Deployed using [Railway](https://railway.app)

- **Frontend**: [https://your-frontend.up.railway.app](https://your-frontend.up.railway.app)
- **Backend**: [https://your-backend.up.railway.app](https://your-backend.up.railway.app)

---

## 🗂️ Folder Structure

```
.
├── frontend/      # React app with React Flow
├── backend/       # FastAPI backend
├── README.md
```

---

## 🛠️ Local Setup Instructions

### 📦 Frontend (React)

```bash
cd frontend
npm install
npm start
```

Runs at: `http://localhost:3000`

---

### 🐍 Backend (FastAPI)

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Runs at: `http://localhost:8000`

---

## 📄 Backend API

### `POST /pipelines/parse`

**Request Body:**
```json
{
  "nodes": [...],
  "edges": [...]
}
```

**Response:**
```json
{
  "num_nodes": 5,
  "num_edges": 4,
  "is_dag": true
}
```

---

## ✨ Features

### ✅ Core
- 📦 React-based visual pipeline builder
- ✍️ TextNode with `{{variable}}` detection
- 🎨 Clean Tailwind styling and layout
- 🔗 FastAPI integration with DAG validation

### 💡 Bonus
- 🔁 Export / Import pipeline as JSON
- ↩️ Undo / Redo support
- 🧠 Hover tooltips
- 🗨️ Inline node comments
- 📌 Minimap view
- 📐 Auto Layout with Dagre
- 🧪 Start Tour (walkthrough)
- 🔤 Keyboard shortcuts
- 🌍 Fully deployed using Railway

---

## 🚀 Railway Deployment Instructions

### Step 1: Backend

1. Go to [https://railway.app](https://railway.app)
2. Create new project → Add Service → GitHub → Root = `backend/`
3. Add build settings:
   - **Install Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port 8000`

### Step 2: Frontend

1. Add another service in the same project → GitHub → Root = `frontend/`
2. Add a `.env` file in `frontend/`:

   ```
   REACT_APP_API_BASE=https://your-backend-service.up.railway.app
   ```

3. Set up:
   - **Install Command:** `npm install`
   - **Start Command:** `npm run build && npx serve -s build`

---

## 📦 Backend Files

### `backend/requirements.txt`
```txt
fastapi
uvicorn
```

### `backend/main.py`
Make sure to include CORS middleware for frontend access:
```python
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/pipelines/parse")
async def parse_pipeline(request: Request):
    data = await request.json()
    nodes = data.get("nodes", [])
    edges = data.get("edges", [])

    from collections import defaultdict, deque
    graph = defaultdict(list)
    indegree = defaultdict(int)

    for edge in edges:
        graph[edge['source']].append(edge['target'])
        indegree[edge['target']] += 1

    queue = deque([node['id'] for node in nodes if indegree[node['id']] == 0])
    visited = 0

    while queue:
        current = queue.popleft()
        visited += 1
        for neighbor in graph[current]:
            indegree[neighbor] -= 1
            if indegree[neighbor] == 0:
                queue.append(neighbor)

    return {
        "num_nodes": len(nodes),
        "num_edges": len(edges),
        "is_dag": visited == len(nodes)
    }
```

---

## 👨‍💻 Author

**Vaibhav Kaushik**  
Built for the VectorShift Technical Interview.

- GitHub: [https://github.com/vaibhavkaushik](https://github.com/vaibhavkaushik)
- LinkedIn: [https://linkedin.com/in/vaibhavkaushik](https://linkedin.com/in/vaibhavkaushik)
- Email: vaibhav@example.com

---

## 📄 License

MIT – use it freely, just give credit.