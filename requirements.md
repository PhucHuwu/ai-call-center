# Yêu cầu Hệ thống - AI Call Center

> **Dự án**: Hệ thống AI trả lời điện thoại tự động dựa trên RAG  
> **Lĩnh vực**: Chăm sóc khách hàng - lấy CellphoneS làm ví dụ  
> **Ngày tạo**: 01/12/2024  
> **Phiên bản**: 1.0

---

## 📋 Mục lục

-   [1. Tổng quan](#1-tổng-quan)
-   [2. Mục tiêu dự án](#2-mục-tiêu-dự-án)
-   [3. Phạm vi hệ thống](#3-phạm-vi-hệ-thống)
-   [4. Yêu cầu chức năng](#4-yêu-cầu-chức-năng)
-   [5. Yêu cầu phi chức năng](#5-yêu-cầu-phi-chức-năng)
-   [6. Kiến trúc kỹ thuật](#6-kiến-trúc-kỹ-thuật)
-   [7. Dữ liệu hệ thống](#7-dữ-liệu-hệ-thống)
-   [8. Tích hợp bên ngoài](#8-tích-hợp-bên-ngoài)
-   [9. Bảo mật và tuân thủ](#9-bảo-mật-và-tuân-thủ)
-   [10. Giới hạn và ràng buộc](#10-giới-hạn-và-ràng-buộc)

---

## 1. Tổng quan

### 1.1. Mô tả dự án

Xây dựng hệ thống AI Call Center tự động sử dụng công nghệ RAG (Retrieval-Augmented Generation) để:

-   Tiếp nhận và xử lý cuộc gọi từ khách hàng 24/7
-   Trả lời câu hỏi về sản phẩm, chính sách, FAQ
-   Chuyển cuộc gọi sang nhân viên khi cần thiết

### 1.2. Bối cảnh

-   **Ngành**: Bán lẻ điện thoại di động và thiết bị công nghệ
-   **Đối tượng phục vụ**: Khách hàng tại Việt Nam
-   **Quy mô**: Hệ thống nhỏ, xử lý đồng thời số lượng cuộc gọi thấp

---

## 2. Mục tiêu dự án

### 2.1. Mục tiêu kinh doanh

-   ✅ Tăng khả năng phục vụ khách hàng 24/7
-   ✅ Giảm tải công việc cho nhân viên chăm sóc khách hàng
-   ✅ Cải thiện trải nghiệm khách hàng với phản hồi nhanh chóng

### 2.2. Mục tiêu kỹ thuật

-   ✅ Xây dựng pipeline AI hoàn chỉnh: STT → RAG → LLM → TTS
-   ✅ Tích hợp với tổng đài số điện thoại Việt Nam
-   ✅ Tự động trả lời câu hỏi dựa trên knowledge base
-   ✅ Phát hiện và chuyển cuộc gọi khi AI không thể xử lý

---

## 3. Phạm vi hệ thống

### 3.1. Trong phạm vi (In scope)

-   ✅ Tiếp nhận cuộc gọi qua số điện thoại Việt Nam
-   ✅ Nhận diện giọng nói (Speech-to-Text)
-   ✅ Tìm kiếm thông tin trong knowledge base (RAG)
-   ✅ Sinh câu trả lời tự nhiên (LLM)
-   ✅ Chuyển đổi văn bản thành giọng nói (Text-to-Speech)
-   ✅ Lưu trữ lịch sử cuộc gọi
-   ✅ Chuyển cuộc gọi sang nhân viên khi cần

### 3.2. Ngoài phạm vi (Out of scope)

-   ❌ Dashboard quản trị (Phase 2)
-   ❌ Báo cáo analytics chi tiết (Phase 2)
-   ❌ Tích hợp CRM/ERP (Phase 2)
-   ❌ Mobile app
-   ❌ Xử lý thanh toán/đặt hàng qua điện thoại

---

## 4. Yêu cầu chức năng

### 4.1. Nhận cuộc gọi (F-001)

**Mô tả**: Hệ thống tiếp nhận cuộc gọi từ khách hàng qua số điện thoại

**Luồng chính**:

1. Khách hàng gọi đến số tổng đài
2. Hệ thống phát lời chào:
    - **Tiếng Việt**: "Xin chào, đây là tổng đài CellphoneS. Tôi là trợ lý ảo, tôi có thể giúp gì cho bạn?"
    - **Tiếng Anh**: "Hello, this is CellphoneS hotline. I'm a virtual assistant, how can I help you?"
3. Hệ thống chờ khách hàng nói

**Acceptance Criteria**:

-   Cuộc gọi được kết nối trong < 3 giây
-   Lời chào được phát ra rõ ràng, tự nhiên

---

### 4.2. Nhận diện giọng nói (F-002)

**Mô tả**: Chuyển đổi giọng nói của khách hàng thành văn bản

**Chi tiết**:

-   **Service**: Groq Whisper-large-v3-turbo
-   **Ngôn ngữ**: Tự động phát hiện (Tiếng Việt, Tiếng Anh)
-   **Real-time**: Xử lý trong khi khách hàng nói

**Acceptance Criteria**:

-   Độ chính xác nhận diện > 85%
-   Latency < 2 giây
-   Hỗ trợ tiếng Việt và tiếng Anh

---

### 4.3. Tìm kiếm thông tin (F-003)

**Mô tả**: Truy xuất thông tin liên quan từ knowledge base bằng RAG

**Chi tiết**:

-   **Vector Database**: FAISS
-   **Embedding Model**: `intfloat/multilingual-e5-large`
-   **Retrieval**: Top-K = 5 chunks
-   **Similarity Threshold**: > 0.7

**Nguồn dữ liệu**:

-   FAQ (391 câu hỏi)
-   Chính sách công ty (16 policies)
-   Thông tin sản phẩm (185KB JSON)

**Acceptance Criteria**:

-   Tìm được thông tin liên quan trong < 1 giây
-   Precision > 80%

---

### 4.4. Sinh câu trả lời (F-004)

**Mô tả**: Tạo câu trả lời tự nhiên dựa trên context từ RAG

**Chi tiết**:

-   **LLM**: Groq `openai/gpt-oss-120b`
-   **Temperature**: 0.7 (cân bằng giữa sáng tạo và chính xác)
-   **Max Tokens**: 150-200 (câu trả lời ngắn gọn)
-   **System Prompt**: Hướng dẫn AI trả lời chuyên nghiệp, thân thiện

**Acceptance Criteria**:

-   Câu trả lời chính xác, phù hợp với context
-   Độ dài: 2-4 câu
-   Không bịa đặt thông tin

---

### 4.5. Chuyển đổi giọng nói (F-005)

**Mô tả**: Chuyển câu trả lời văn bản thành giọng nói

**Chi tiết**:

-   **Service**: Groq PlayAI-TTS
-   **Voice**:
    -   Tiếng Việt: Voice ID phù hợp (cần test)
    -   Tiếng Anh: `Aaliyah-PlayAI`
-   **Format**: WAV, 16kHz

**Acceptance Criteria**:

-   Giọng nói tự nhiên, rõ ràng
-   Latency < 2 giây

---

### 4.6. Chuyển nhân viên (F-006)

**Mô tả**: Chuyển cuộc gọi sang nhân viên trong các trường hợp:

**Trigger Conditions**:

1. RAG confidence score < 0.6
2. Khách hàng yêu cầu: "gặp nhân viên", "operator", "người thật"
3. Không tìm thấy thông tin trong knowledge base
4. Vượt quá 7 lượt hội thoại không giải quyết được

**Acceptance Criteria**:

-   Phát hiện trigger chính xác > 90%
-   Chuyển cuộc gọi mượt mà, không bị ngắt

---

### 4.7. Lưu trữ lịch sử (F-007)

**Mô tả**: Lưu toàn bộ thông tin cuộc gọi vào database

**Dữ liệu lưu trữ**:

-   Call ID, số điện thoại, thời gian bắt đầu/kết thúc
-   Transcript (văn bản hội thoại)
-   Confidence scores
-   Audio URL (nếu có ghi âm)
-   Kết quả: đã giải quyết / chuyển nhân viên / lỗi

**Acceptance Criteria**:

-   Lưu trữ 100% cuộc gọi
-   Truy xuất được trong < 1 giây

---

## 5. Yêu cầu phi chức năng

### 5.1. Hiệu năng (NFR-001)

| Metric               | Requirement                           |
| -------------------- | ------------------------------------- |
| **Response Time**    | < 5 giây (end-to-end)                 |
| **STT Latency**      | < 2 giây                              |
| **LLM Latency**      | < 2 giây                              |
| **TTS Latency**      | < 2 giây                              |
| **RAG Retrieval**    | < 1 giây                              |
| **Concurrent Calls** | Hỗ trợ tối thiểu 5 cuộc gọi đồng thời |

---

### 5.2. Khả năng mở rộng (NFR-002)

-   Hệ thống có thể scale up khi tăng lượng cuộc gọi
-   Database có thể mở rộng khi tăng dữ liệu

---

### 5.3. Độ tin cậy (NFR-003)

-   **Uptime**: 99% (cho phép downtime ~7 giờ/tháng)
-   **Error Rate**: < 5%
-   **Fallback**: Có message dự phòng khi service fail

---

### 5.4. Độ chính xác (NFR-004)

| Component            | Accuracy Requirement |
| -------------------- | -------------------- |
| **STT**              | > 85%                |
| **RAG Retrieval**    | > 80% precision      |
| **Intent Detection** | > 90%                |

---

### 5.5. Khả dụng (NFR-005)

-   **Availability**: 24/7
-   **Multi-language**: Tiếng Việt + Tiếng Anh
-   **Accessibility**: Hỗ trợ cho người khiếm thị (giọng nói rõ ràng)

---

## 6. Kiến trúc kỹ thuật

### 6.1. Tech Stack

#### Backend

-   **Framework**: FastAPI (Python)
-   **Python Version**: 3.10+
-   **API Style**: RESTful + WebSocket (cho streaming)

#### AI/ML Services

| Component     | Service     | Model                    |
| ------------- | ----------- | ------------------------ |
| **STT**       | Groq        | `whisper-large-v3-turbo` |
| **LLM**       | Groq        | `openai/gpt-oss-120b`    |
| **TTS**       | Groq        | `playai-tts`             |
| **Embedding** | HuggingFace | `multilingual-e5-large`  |

#### Database

-   **Relational DB**: PostgreSQL 14+
-   **Vector DB**: FAISS (local index)
-   **Cache**: Redis (optional, for session management)

#### Telephony

-   **Provider**: Stringee.vn
-   **Type**: Cloud telephony với số điện thoại Việt Nam
-   **Protocol**: WebRTC, SIP

---

### 6.2. Chunking Strategy

#### FAQ Data

```yaml
Strategy: ONE_QA_PER_CHUNK
Chunk Size: 50-500 tokens
Overlap: 0 tokens
Metadata:
    - source: faq
    - question: <text>
    - doc_id: <id>
```

#### Policy Data

```yaml
Strategy: SEMANTIC_SPLIT
Chunk Size: 500-800 tokens
Overlap: 100 tokens
Split By: Section/Title
Metadata:
    - source: policy
    - category: <text>
    - title: <text>
    - section_index: <number>
```

#### Product Data

```yaml
Strategy: MULTI_CHUNK
Chunks Per Product: 3
  - Overview: 300-500 tokens
  - Detailed Specs: 500-800 tokens
  - Variants: 100-200 tokens
Metadata:
  - source: product
  - product_id: <id>
  - product_name: <name>
  - chunk_type: overview|specs|variants
```

---

### 6.3. Database Schema

#### Table: `calls`

```sql
CREATE TABLE calls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone_number VARCHAR(20),
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    duration INTEGER, -- giây
    status VARCHAR(20), -- completed, transferred, error
    language VARCHAR(5), -- vi, en
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### Table: `messages`

```sql
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    call_id UUID REFERENCES calls(id) ON DELETE CASCADE,
    timestamp TIMESTAMP NOT NULL,
    role VARCHAR(10) NOT NULL, -- user, assistant
    content TEXT NOT NULL,
    audio_url TEXT,
    confidence_score FLOAT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### Table: `analytics`

```sql
CREATE TABLE analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    call_id UUID REFERENCES calls(id) ON DELETE CASCADE,
    metric_name VARCHAR(50) NOT NULL,
    metric_value JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 7. Dữ liệu hệ thống

### 7.1. Knowledge Base

| Dataset      | Size  | Format | Records       | Location                    |
| ------------ | ----- | ------ | ------------- | --------------------------- |
| **FAQ**      | 47KB  | JSON   | 391 Q&A       | `data/faq.json`             |
| **Policy**   | 38KB  | JSON   | 16 policies   | `data/policy_dataset.json`  |
| **Products** | 185KB | JSON   | ~100 products | `data/product_details.json` |

### 7.2. Data Structure

#### FAQ

```json
{
    "question": "iPhone 16 Pro Max có chống nước không?",
    "answer": "Có, iPhone 16 Pro Max đạt chuẩn IP68..."
}
```

#### Policy

```json
{
    "category": "PHẦN I. QUY ĐỊNH CHUNG",
    "title": "I. Nguyên tắc chung",
    "content": "Website thương mại điện tử..."
}
```

#### Product

```json
{
    "id": "iphone-16-pro-max",
    "name": "iPhone 16 Pro Max 256GB",
    "specs": {
        /* detailed specs */
    },
    "variants": [
        /* color/price variants */
    ],
    "description": "..."
}
```

---

## 8. Tích hợp bên ngoài

### 8.1. Groq API

-   **Endpoint**: `https://api.groq.com/`
-   **Authentication**: API Key (Bearer token)
-   **Rate Limits**: Theo plan (cần confirm)
-   **Services sử dụng**:
    -   Speech-to-Text
    -   Chat Completions
    -   Text-to-Speech

### 8.2. Stringee Telephony

-   **Endpoint**: `https://api.stringee.com/`
-   **Authentication**: API Key SID + Secret
-   **Webhooks**:
    -   `/webhook/incoming-call`
    -   `/webhook/answer`
    -   `/webhook/hangup`

---

## 9. Bảo mật và tuân thủ

### 9.1. Bảo mật

-   ✅ API keys lưu trong `.env` (không commit lên Git)
-   ✅ HTTPS/TLS cho tất cả connections
-   ✅ Webhook signature validation (Stringee)
-   ✅ Rate limiting cho API endpoints
-   ✅ Input sanitization (SQL injection, XSS)

### 9.2. Dữ liệu cá nhân

-   Số điện thoại được hash trước khi lưu (optional)
-   Audio recordings tự động xóa sau 30 ngày (tuân thủ GDPR)
-   Không lưu thông tin nhạy cảm (thẻ tín dụng, CMND...)

---

## 10. Giới hạn và ràng buộc

### 10.1. Giới hạn kỹ thuật

-   ❌ Không xử lý nhiễu nền quá lớn (quán cafe, đường phố ồn ào)
-   ❌ Không hỗ trợ phương ngữ địa phương mạnh
-   ❌ Không xử lý được câu hỏi ngoài knowledge base

### 10.2. Giới hạn ngôn ngữ

-   ✅ Hỗ trợ: Tiếng Việt, Tiếng Anh
-   ❌ Không hỗ trợ: Tiếng Trung, Nhật, Hàn...

### 10.3. Giới hạn chức năng

-   ❌ Không thực hiện giao dịch (đặt hàng, thanh toán)
-   ❌ Không truy cập thông tin đơn hàng cá nhân
-   ❌ Không xử lý khiếu nại phức tạp (cần nhân viên)

---

## 11. Môi trường triển khai

### 11.1. Development

-   **OS**: macOS / Linux / Windows
-   **Python**: 3.10+
-   **Local testing**: Ngrok (expose webhooks)

### 11.2. Production

-   **Deployment**: VPS / Docker / Cloud (chưa xác định)
-   **OS**: Ubuntu 22.04 LTS
-   **Web Server**: Uvicorn + Nginx (reverse proxy)
-   **Process Manager**: Supervisor / systemd

---

## 12. Success Criteria

Hệ thống được coi là **thành công** khi:

1. ✅ Trả lời chính xác > 80% câu hỏi trong knowledge base
2. ✅ Response time < 5 giây (end-to-end)
3. ✅ Uptime > 99%
4. ✅ Khách hàng hài lòng với trải nghiệm AI voice (subjective)
5. ✅ Giảm tải 50% cuộc gọi cho nhân viên thực

---

## 13. Rủi ro và giảm thiểu

| Rủi ro                       | Mức độ | Giảm thiểu                                    |
| ---------------------------- | ------ | --------------------------------------------- |
| **Groq API downtime**        | Medium | Retry logic + fallback message                |
| **STT nhận diện sai**        | High   | Confidence threshold + confirm với người dùng |
| **RAG trả về sai thông tin** | High   | Similarity threshold + human review           |
| **Stringee service fail**    | Medium | Health check + alert                          |
| **Knowledge base lỗi thời**  | Medium | Quy trình cập nhật định kỳ                    |

---

## 14. Timeline (Tham khảo)

| Phase                                 | Duration | Deliverables                                      |
| ------------------------------------- | -------- | ------------------------------------------------- |
| **Phase 1**: Setup & Data Preparation | 1 week   | - Environment setup<br>- Data chunking & indexing |
| **Phase 2**: RAG Pipeline             | 1 week   | - FAISS setup<br>- Retrieval testing              |
| **Phase 3**: AI Integration           | 1 week   | - Groq STT/LLM/TTS<br>- End-to-end pipeline       |
| **Phase 4**: Telephony Integration    | 1 week   | - Stringee setup<br>- Webhook handlers            |
| **Phase 5**: Testing & Optimization   | 1 week   | - Integration testing<br>- Performance tuning     |
| **Phase 6**: Deployment               | 3 days   | - Production deployment<br>- Monitoring setup     |

**Total**: ~5-6 tuần

---

## 15. Contacts & References

### Team

-   **Product Owner**: TinaSoft
-   **Tech Lead**: Phuoc Nguyen Thanh
-   **Developer**: Phuc Tran Huu

### External Services

-   **Groq**: https://console.groq.com
-   **Stringee**: https://developer.stringee.com
-   **PostgreSQL**: https://www.postgresql.org

---
