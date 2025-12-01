# Implementation Plan - AI Call Center

> **Project**: AI-powered Call Center with RAG  
> **Team**: TinaSoft - Phuoc Nguyen Thanh (Tech Lead), Phuc Tran Huu (Developer)  
> **Date**: 01/12/2024  
> **Version**: 1.0

---

## 1. Executive Summary

Xây dựng hệ thống AI Call Center tự động sử dụng RAG để trả lời câu hỏi khách hàng 24/7. Tài liệu này trình bày 2 phương án triển khai và roadmap chi tiết.

**Timeline**: 5-6 tuần  
**Tech Stack**: FastAPI + Groq AI + PostgreSQL + FAISS  
**Telephony Options**: Stringee (recommended) hoặc WebRTC

---

## 2. Telephony Solution Comparison

### Option 1: Stringee Cloud Telephony ⭐ **RECOMMENDED**

**Pros:**

-   ✅ Số điện thoại VN (1900, 1800, mobile)
-   ✅ API/SDK đầy đủ (Python SDK available)
-   ✅ Infrastructure sẵn có (không cần maintain)
-   ✅ Tài liệu tốt, support tiếng Việt
-   ✅ Time-to-market nhanh (2-3 tuần)
-   ✅ Costs: ~500-800 VNĐ/phút

**Cons:**

-   ❌ Phụ thuộc vendor (lock-in risk)
-   ❌ Chi phí recurring hàng tháng

**Use Cases:**

-   Production-ready solution
-   Cần số điện thoại thật
-   Ưu tiên stability > customization

---

### Option 2: Custom WebRTC Solution

**Pros:**

-   ✅ Full control (100% customizable)
-   ✅ Không phụ thuộc vendor
-   ✅ Chi phí vận hành thấp hơn lâu dài
-   ✅ Tích hợp web/mobile dễ dàng

**Cons:**

-   ❌ KHÔNG có số điện thoại VN thật
-   ❌ Phức tạp hơn nhiều (4-5 tuần)
-   ❌ Cần expertise về WebRTC, TURN/STUN servers
-   ❌ Phải maintain infrastructure
-   ❌ Clients phải gọi qua web/app (không gọi SĐT trực tiếp)

**Use Cases:**

-   Internal tool / demo / POC
-   Tích hợp vào website/app
-   Budget constraints
-   Yêu cầu customization cao

---

### Decision Matrix

| Criteria            | Stringee  | WebRTC    | Winner      |
| ------------------- | --------- | --------- | ----------- |
| **Time to Market**  | 2-3 tuần  | 4-5 tuần  | 🏆 Stringee |
| **Phone Number**    | ✅ Yes    | ❌ No     | 🏆 Stringee |
| **Cost (6 months)** | ~3-5M VNĐ | ~1-2M VNĐ | 🏆 WebRTC   |
| **Maintenance**     | Low       | High      | 🏆 Stringee |
| **Flexibility**     | Medium    | High      | 🏆 WebRTC   |
| **Reliability**     | High      | Medium    | 🏆 Stringee |

**Recommendation**: **Stringee** cho production, **WebRTC** cho POC/demo.

---

## 3. System Architecture

### 3.1. High-Level Architecture (Stringee)

```mermaid
flowchart TD
    A["Customer<br/>(Gọi 1900/1800)"] -->|Voice Call| B["Stringee<br/>Cloud Telephony<br/>(Số điện thoại VN)"]
    B -->|Webhook HTTP| C["FastAPI Backend"]

    subgraph C["FastAPI Backend"]
        C1["Call Handler<br/>(Webhook)"]
        C2["Audio Processor"]
        C3["AI Pipeline<br/>Orchestrator"]
    end

    C -->|API Calls| D["Groq AI Services"]
    C -->|Store/Retrieve| E["PostgreSQL + FAISS"]

    subgraph D["Groq AI Services"]
        D1["Whisper<br/>(STT)"]
        D2["GPT-OSS-120B<br/>(LLM)"]
        D3["PlayAI-TTS<br/>(TTS)"]
    end

    subgraph E["Data Layer"]
        E1["PostgreSQL<br/>(Calls, Messages)"]
        E2["FAISS<br/>(Vector Search)"]
    end

    style A fill:#e1f5ff
    style B fill:#fff4e6
    style C fill:#e8f5e9
    style D fill:#f3e5f5
    style E fill:#fce4ec
```

### 3.2. High-Level Architecture (WebRTC)

```mermaid
flowchart TD
    A["Customer<br/>(Web/Mobile App)"] -->|WebRTC| B["Frontend<br/>(React/Vue)"]

    subgraph B["Frontend Application"]
        B1["MediaStream API"]
        B2["WebSocket Client"]
        B3["Audio Streamer"]
    end

    B -->|WebSocket + Audio Stream| C["FastAPI Backend"]

    subgraph C["FastAPI Backend"]
        C1["WebSocket Handler"]
        C2["WebRTC Signaling"]
        C3["Audio Stream<br/>Processor"]
        C4["AI Pipeline"]
    end

    C -->|API Calls| D["Groq AI Services"]
    C -->|Store/Retrieve| E["Data Layer"]

    subgraph D["Groq AI Services"]
        D1["Whisper<br/>(STT)"]
        D2["GPT-OSS-120B<br/>(LLM)"]
        D3["PlayAI-TTS<br/>(TTS)"]
    end

    subgraph E["Data Layer"]
        E1["PostgreSQL<br/>(Calls, Messages)"]
        E2["FAISS<br/>(Vector Search)"]
    end

    style A fill:#e1f5ff
    style B fill:#fff4e6
    style C fill:#e8f5e9
    style D fill:#f3e5f5
    style E fill:#fce4ec
```

---

## 4. AI Pipeline Flow

```mermaid
flowchart TB
    A["🎤 Audio Stream<br/>(từ Stringee/WebRTC)"] --> B["1️⃣ Groq Whisper STT"]
    B -->|Transcription| C["📝 Text Input<br/>'iPhone 16 Pro Max giá bao nhiêu?'"]
    C --> D["2️⃣ RAG Pipeline"]

    subgraph D["RAG Processing"]
        D1["Embedding<br/>(multilingual-e5-large)"]
        D2["FAISS Search<br/>(Top-5, similarity > 0.7)"]
        D3["Retrieved Chunks"]
        D1 --> D2 --> D3
    end

    D --> E["3️⃣ Groq LLM<br/>(openai/gpt-oss-120b)"]

    subgraph E["LLM Generation"]
        E1["Context: Chunks + History"]
        E2["System Prompt"]
        E3["Generate Response"]
        E1 --> E3
        E2 --> E3
    end

    E -->|Generated Text| F["💬 Response<br/>'iPhone 16 Pro Max 256GB có giá...'"]
    F --> G["4️⃣ Groq PlayAI TTS"]
    G -->|Audio Stream| H["🔊 Audio Output → Customer"]

    style A fill:#e3f2fd
    style C fill:#fff3e0
    style D fill:#e8f5e9
    style E fill:#f3e5f5
    style F fill:#fff9c4
    style H fill:#ffebee

    I["⏱️ Total Latency Target: < 5 seconds"]
    style I fill:#ffcdd2,stroke:#d32f2f,stroke-width:2px
```

**Breakdown Latency:**

-   STT (Whisper): ~1-2s
-   RAG (Embedding + Search): ~0.5-1s
-   LLM (Generation): ~1-2s
-   TTS (PlayAI): ~1-2s
-   **Total**: ~4-7s (target < 5s for p95)

---

## 5. Project Structure

```
ai-call-center/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI app entry
│   ├── config.py               # Settings (env vars)
│   ├── api/
│   │   ├── __init__.py
│   │   ├── webhooks.py         # Stringee webhooks
│   │   └── websocket.py        # WebRTC signaling
│   ├── services/
│   │   ├── __init__.py
│   │   ├── stt_service.py      # Groq Whisper
│   │   ├── llm_service.py      # Groq LLM
│   │   ├── tts_service.py      # Groq PlayAI
│   │   ├── rag_service.py      # RAG pipeline
│   │   └── call_service.py     # Call orchestration
│   ├── models/
│   │   ├── __init__.py
│   │   ├── database.py         # SQLAlchemy models
│   │   └── schemas.py          # Pydantic schemas
│   └── utils/
│       ├── __init__.py
│       ├── chunking.py         # Data chunking
│       └── logger.py           # Logging
├── data/
│   ├── faq.json
│   ├── policy_dataset.json
│   └── product_details.json
├── scripts/
│   ├── build_faiss_index.py   # Build vector DB
│   ├── init_db.py              # Init PostgreSQL
│   └── test_pipeline.py        # Integration tests
├── frontend/                   # (WebRTC only)
│   ├── index.html
│   ├── app.js
│   └── styles.css
├── .env                        # Environment variables
├── .env.example
├── requirements.txt
├── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## 6. Implementation Phases

### **Phase 1: Environment Setup** (3 days)

**Tasks:**

-   [ ] Setup Python 3.10+ venv
-   [ ] Install dependencies (`requirements.txt`)
-   [ ] Setup PostgreSQL local/Docker
-   [ ] Create `.env` with API keys
-   [ ] Initialize Git repo

**Deliverables:**

-   Working dev environment
-   Database connection verified

---

### **Phase 2: Data Processing & RAG** (5 days)

**Tasks:**

-   [ ] Implement chunking strategies (FAQ, Policy, Products)
-   [ ] Generate embeddings (multilingual-e5-large)
-   [ ] Build FAISS index
-   [ ] Implement RAG retrieval service
-   [ ] Test retrieval accuracy

**Deliverables:**

-   `scripts/build_faiss_index.py`
-   `app/services/rag_service.py`
-   FAISS index file (`faiss_index.bin`)

**Key Code:**

```python
# app/services/rag_service.py
class RAGService:
    def __init__(self):
        self.index = faiss.read_index("faiss_index.bin")
        self.embedder = SentenceTransformer("intfloat/multilingual-e5-large")

    def retrieve(self, query: str, k=5, threshold=0.7):
        query_vector = self.embedder.encode([query])
        distances, indices = self.index.search(query_vector, k)
        # Filter by threshold
        return [chunk for chunk, dist in zip(chunks, distances[0]) if dist > threshold]
```

---

### **Phase 3: Groq AI Integration** (5 days)

**Tasks:**

-   [ ] Implement STT service (Whisper)
-   [ ] Implement LLM service (gpt-oss-120b)
-   [ ] Implement TTS service (PlayAI-TTS)
-   [ ] Design system prompt template
-   [ ] Test end-to-end AI pipeline

**Deliverables:**

-   `app/services/stt_service.py`
-   `app/services/llm_service.py`
-   `app/services/tts_service.py`

**Key Code:**

```python
# app/services/llm_service.py
from groq import Groq

class LLMService:
    def __init__(self):
        self.client = Groq(api_key=os.getenv("GROQ_API_KEY"))

    def generate_response(self, query: str, context: list, history: list):
        messages = [
            {"role": "system", "content": SYSTEM_PROMPT},
            *history,
            {"role": "user", "content": f"Context: {context}\n\nQuestion: {query}"}
        ]
        response = self.client.chat.completions.create(
            model="openai/gpt-oss-120b",
            messages=messages,
            temperature=0.7,
            max_completion_tokens=200
        )
        return response.choices[0].message.content
```

---

### **Phase 4A: Stringee Integration** (5 days)

**Tasks:**

-   [ ] Register Stringee account, get API keys
-   [ ] Setup webhook endpoints
-   [ ] Implement call handler
-   [ ] Test incoming call flow
-   [ ] Implement transfer-to-human logic

**Deliverables:**

-   `app/api/webhooks.py`
-   Ngrok tunnel for local testing

**Key Code:**

```python
# app/api/webhooks.py
from fastapi import APIRouter, Request

router = APIRouter()

@router.post("/stringee/answer")
async def handle_answer(request: Request):
    data = await request.json()
    call_id = data["from_number"]

    return {
        "actions": [
            {
                "action": "talk",
                "text": "Xin chào, đây là tổng đài CellphoneS...",
                "voice": "vi-VN"
            },
            {
                "action": "record",
                "url": f"{BASE_URL}/stringee/recording"
            }
        ]
    }

@router.post("/stringee/recording")
async def handle_recording(request: Request):
    data = await request.json()
    audio_url = data["recordingUrl"]

    # Download audio → STT → RAG → LLM → TTS → respond
    transcript = await stt_service.transcribe(audio_url)
    # ... AI pipeline
    response_audio = await tts_service.synthesize(response_text)

    return {
        "actions": [
            {"action": "play", "url": response_audio},
            {"action": "record"}  # Continue conversation
        ]
    }
```

---

### **Phase 4B: WebRTC Integration** (7 days)

**Tasks:**

-   [ ] Setup WebRTC signaling server (WebSocket)
-   [ ] Implement frontend (HTML/JS)
-   [ ] Handle ICE candidates, SDP exchange
-   [ ] Stream audio to backend
-   [ ] Test browser compatibility

**Deliverables:**

-   `app/api/websocket.py`
-   `frontend/` directory

**Key Code:**

```python
# app/api/websocket.py
from fastapi import WebSocket

@app.websocket("/ws/call")
async def websocket_call(websocket: WebSocket):
    await websocket.accept()

    while True:
        data = await websocket.receive_bytes()  # Audio chunks

        # STT
        transcript = await stt_service.transcribe_stream(data)

        # RAG + LLM
        response = await ai_pipeline.process(transcript)

        # TTS
        audio = await tts_service.synthesize(response)

        # Send back
        await websocket.send_bytes(audio)
```

---

### **Phase 5: Database & Logging** (3 days)

**Tasks:**

-   [ ] Create PostgreSQL schemas
-   [ ] Implement SQLAlchemy models
-   [ ] Save call sessions, messages
-   [ ] Implement logging (structlog)
-   [ ] Add error handling

**Deliverables:**

-   `app/models/database.py`
-   `scripts/init_db.py`

---

### **Phase 6: Testing & Optimization** (5 days)

**Tasks:**

-   [ ] Unit tests (pytest)
-   [ ] Integration tests
-   [ ] Load testing (simulate 5 concurrent calls)
-   [ ] Optimize latency (caching, async)
-   [ ] Fix bugs

**Acceptance:**

-   Response time < 5s (95th percentile)
-   Error rate < 5%
-   RAG accuracy > 80%

---

### **Phase 7: Deployment** (3 days)

**Tasks:**

-   [ ] Create Dockerfile
-   [ ] Setup docker-compose (App + PostgreSQL)
-   [ ] Deploy to VPS/Cloud
-   [ ] Configure Nginx reverse proxy
-   [ ] Setup monitoring (healthcheck)

---

## 7. Database Schema

```sql
-- Calls table
CREATE TABLE calls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone_number VARCHAR(20),
    session_id VARCHAR(100) UNIQUE,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    duration INTEGER,
    status VARCHAR(20),  -- completed, transferred, error
    language VARCHAR(5),  -- vi, en
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_calls_session ON calls(session_id);
CREATE INDEX idx_calls_phone ON calls(phone_number);

-- Messages table
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    call_id UUID REFERENCES calls(id) ON DELETE CASCADE,
    timestamp TIMESTAMP NOT NULL,
    role VARCHAR(10) NOT NULL,  -- user, assistant
    content TEXT NOT NULL,
    audio_url TEXT,
    confidence_score FLOAT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_messages_call ON messages(call_id);
```

---

## 8. Environment Variables

```bash
# .env.example

# Groq AI
GROQ_API_KEY=gsk_xxxxxxxxxxxxx

# Stringee (Option 1)
STRINGEE_API_KEY_SID=xxxxx
STRINGEE_API_KEY_SECRET=xxxxx

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/ai_call_center

# Backend
BASE_URL=https://your-domain.com  # or ngrok URL for dev
ENVIRONMENT=development  # development, production

# RAG
FAISS_INDEX_PATH=./data/faiss_index.bin
EMBEDDING_MODEL=intfloat/multilingual-e5-large
TOP_K=5
SIMILARITY_THRESHOLD=0.7

# Logging
LOG_LEVEL=INFO
```

---

## 9. Key Technical Decisions

### 9.1. Why FastAPI?

-   Async support → better for I/O-bound tasks (API calls)
-   Auto API docs (Swagger)
-   Type hints → fewer bugs
-   WebSocket support (for WebRTC)

### 9.2. Why FAISS instead of Pinecone/Weaviate?

-   Local, no vendor dependency
-   Free, fast
-   Good enough for small-medium dataset (<1M docs)

### 9.3. Why PostgreSQL + FAISS hybrid?

-   PostgreSQL: Structured data (calls, messages)
-   FAISS: Vector search (RAG)
-   Separation of concerns

### 9.4. Why Redis (Optional)?

-   Session caching (conversation history)
-   Rate limiting
-   Temporary storage (audio buffers)

---

## 10. Risks & Mitigations

| Risk                             | Impact | Mitigation                                   |
| -------------------------------- | ------ | -------------------------------------------- |
| **Groq API downtime**            | High   | Retry logic, fallback message                |
| **STT accuracy low**             | High   | Confidence threshold, confirmation           |
| **RAG retrieves wrong info**     | High   | Similarity threshold 0.7, human review       |
| **Latency > 5s**                 | Medium | Optimize chunking, async processing, caching |
| **WebRTC browser compatibility** | Medium | Test on Chrome, Firefox, Safari              |

---

## 11. Testing Strategy

### Unit Tests

```bash
pytest tests/unit/
```

-   RAG service
-   Chunking logic
-   Prompt templates

### Integration Tests

```bash
pytest tests/integration/
```

-   Full AI pipeline (STT → RAG → LLM → TTS)
-   Webhook handlers
-   Database CRUD

### Manual Testing

-   Real phone calls (Stringee)
-   Browser calls (WebRTC)
-   Edge cases (noise, accent, silence...)

---

## 12. Success Metrics

| Metric            | Target                     |
| ----------------- | -------------------------- |
| **Response Time** | < 5s (p95)                 |
| **RAG Accuracy**  | > 80%                      |
| **STT Accuracy**  | > 85%                      |
| **Uptime**        | > 99%                      |
| **Transfer Rate** | < 30% (70% resolved by AI) |

---

## 13. Next Steps

1. ✅ **Approve this plan**
2. ⏳ **Choose telephony option** (Stringee or WebRTC)
3. ⏳ **Setup development environment**
4. ⏳ **Start Phase 1**

---

## Appendix: Quick Start Commands

```bash
# Clone repo
git clone <repo-url>
cd ai-call-center

# Setup venv
python3.10 -m venv venv
source venv/bin/activate

# Install deps
pip install -r requirements.txt

# Setup .env
cp .env.example .env
# Edit .env with your API keys

# Init database
python scripts/init_db.py

# Build FAISS index
python scripts/build_faiss_index.py

# Run dev server
uvicorn app.main:app --reload --port 8000

# Expose with ngrok (for Stringee webhooks)
ngrok http 8000
```

---

**Document Owner**: Phuc Tran Huu  
**Reviewed by**: Phuoc Nguyen Thanh  
**Status**: ✅ Ready for Implementation
