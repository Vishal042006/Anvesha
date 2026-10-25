# ANVESHA 3.0 — Local AI & Ollama Integration Guide

ANVESHA integrates local language models via **Ollama** for private, on-premise, zero-cloud natural-language intelligence synthesis.

---

## 1. Architectural Role & Statistical Firewall

```
[Statistical & Machine Learning Engine]
   │ (Deterministic Panel Calculations: Change Points, Regimes, Conformal Bounds)
   ▼
[Structured Evidence Object]
   │ { unit: "Chennai", change_point: 2021, regime: "Increasing", forecast: 61048.6, picp: 90.9% }
   ▼
[Strict Statistical Firewall]
   │ (The LLM is strictly prohibited from generating numbers or calculating predictions)
   ▼
[Local Ollama / Qwen 2.5] ──► Plain-Language Executive Briefing
   │ (If offline)
   ▼
[Deterministic Rule-Based Synthesis Fallback] ──► Guaranteed High Availability
```

### Core Invariants:
1. **The LLM never calculates crime numbers:** All forecasts, error metrics, change points, and prediction intervals are computed deterministically by the Python research engine.
2. **The LLM never fabricates citations:** Citations are supplied in the evidence payload from verified OpenAlex, Crossref, and Semantic Scholar records.
3. **Graceful Degradation:** If Ollama is offline, uninstalled, or unreachable, the system automatically falls back to `ANVESHA_NEURAL_SYNTHESIS_ACTIVE`, producing deterministic rule-based linguistic synthesis with zero UI crashes.

---

## 2. Installation Instructions by Operating System

### 2.1 macOS (Apple Silicon / Intel)
1. **Install via Homebrew:**
   ```bash
   brew install ollama
   ```
2. **Start the background service:**
   ```bash
   ollama serve
   ```
   *(By default, Ollama listens on `http://127.0.0.1:11434`)*.
3. **Pull the lightweight Qwen 2.5 model (494MB):**
   ```bash
   ollama pull qwen2.5:0.5b
   ```

### 2.2 Linux (Ubuntu / Debian / RHEL)
1. **Install via official installer script:**
   ```bash
   curl -fsSL https://ollama.com/install.sh | sh
   ```
2. **Start service:**
   ```bash
   systemctl start ollama
   ```
3. **Pull model:**
   ```bash
   ollama pull qwen2.5:0.5b
   ```

### 2.3 Windows (WSL2 / Native)
1. Download the Windows installer from [ollama.com/download/windows](https://ollama.com/download/windows).
2. Run the installer and launch Ollama from the system tray.
3. Open PowerShell or Command Prompt:
   ```powershell
   ollama pull qwen2.5:0.5b
   ```

---

## 3. Configuration in ANVESHA

Edit your local `.env` file in the project root:

```env
# Local Ollama Configuration
OLLAMA_BASE_URL=http://127.0.0.1:11434
OLLAMA_MODEL=qwen2.5:0.5b
```

### Scaling Options:
If your hardware includes dedicated GPU acceleration (Apple M-series unified memory $\ge 16\text{GB}$, or NVIDIA RTX with $\ge 8\text{GB}$ VRAM), you may upgrade to:
```bash
ollama pull qwen2.5:1.5b
# or
ollama pull qwen2.5:7b
```
and update `OLLAMA_MODEL=qwen2.5:7b` in your `.env`.

---

## 4. Verification & Testing

### 4.1 Verify Ollama API Directly
```bash
curl -s http://127.0.0.1:11434/api/generate -d '{
  "model": "qwen2.5:0.5b",
  "prompt": "Summarize the primary purpose of police beat patrolling.",
  "stream": false
}'
```

### 4.2 Verify ANVESHA Live Explainability Endpoint
```bash
curl -s "http://127.0.0.1:8000/api/v1/crimeshift/explain/Chennai?category=ALL_CRIME" | python3 -m json.tool
```
Expected output confirmation:
```json
{
  "engine_status": "OLLAMA_QWEN_ACTIVE",
  "explanation_source": "Qwen 2.5 (qwen2.5:0.5b)"
}
```
