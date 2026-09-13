# 🍃 EcoTruth — AI-Powered Greenwashing Detector

**Verify sustainability claims instantly with a grounded, hallucination-free AI engine.**

EcoTruth is a full-stack application built to combat *greenwashing* — the deceptive use of marketing language to make products appear more environmentally friendly than they actually are. It pairs **Google Gemini 2.0-Flash** with a strictly enforced reference dataset, so every rating EcoTruth gives is verifiable and defensible, not guessed.

---

## Table of Contents

- [Why EcoTruth](#why-ecotruth)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [How the Grounding Engine Works](#how-the-grounding-engine-works)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#1-backend-setup-fastapi)
  - [Frontend Setup](#2-frontend-setup-reactvite)
- [Project Structure](#project-structure)
- [Roadmap](#roadmap)
- [Hackathon Submission](#hackathon-submission)
- [Author](#author)

---

## Why EcoTruth

Sustainability marketing is full of vague, unverifiable buzzwords — "eco-friendly," "all-natural," "green" — that carry no legal weight. At the same time, genuine certifications like USDA Organic or B Corp are drowned out by noise. EcoTruth gives consumers and researchers a fast, consistent way to tell the difference by checking every claim against a curated dataset instead of relying on an LLM's unguided judgment.

## Features

- **Instant Claim Analysis** — Paste any product description or marketing claim to get an immediate sustainability rating.
- **Zero AI Hallucinations (Grounding Engine)** — The model is explicitly tethered to a custom `dataset.json` containing 50 recognized global certifications (e.g., USDA Organic, B Corp) and 20 known red-flag buzzwords (e.g., "eco-friendly," "all-natural").
- **Structured Output Enforcement** — FastAPI and Pydantic schemas force Gemini to return strict, predictable JSON (`Certified`, `Red Flag`, or `Vague`), keeping the UI stable and type-safe.
- **Modern, Responsive UI** — A clean React frontend displaying confidence scores, detailed explanations, and visual badges for each rating.

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React (Vite), TypeScript / JavaScript, Figma-to-Code UI components |
| **Backend** | FastAPI (Python), Pydantic, Uvicorn |
| **AI Engine** | Google Gemini 2.0-Flash API, structured system prompting with context injection |

## How the Grounding Engine Works

1. **Input** — The user submits a claim through the React frontend.
2. **Dataset Injection** — The FastAPI backend loads `dataset.json` (certifications and red flags) and injects it dynamically into the Gemini system prompt.
3. **Strict Evaluation** — The model is instructed to validate the claim *only* against the provided dataset — no outside assumptions.
4. **Structured JSON Output** — The response is returned matching a strict Pydantic model containing `rating`, `explanation`, and `key_red_flags`.

## Getting Started

### Prerequisites

- Python 3.9+
- Node.js 18+ and npm (or pnpm)
- A [Google Gemini API key](https://ai.google.dev/)

### 1. Backend Setup (FastAPI)

```bash
# Clone the repository
git clone https://github.com/your-username/Eco_Truth.git
cd Eco_Truth

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate       # Mac/Linux
venv\Scripts\activate          # Windows

# Install dependencies
pip install fastapi uvicorn pydantic google-genai python-dotenv

# Configure your API key
echo 'GEMINI_API_KEY="your_actual_api_key_here"' > .env

# Run the backend server
uvicorn main:app --reload
```

The backend runs at `http://127.0.0.1:8000` — visit `/docs` for the interactive API reference.

### 2. Frontend Setup (React/Vite)

In a new terminal window:

```bash
# Install dependencies
npm install

# Start the Vite development server
npm run dev
```

The frontend runs at `http://localhost:5173` (or the port shown in your terminal).

## Project Structure

```
Eco_Truth/
├── backend/
│   ├── main.py           # FastAPI app & routes
│   ├── dataset.json       # Certifications & red-flag reference data
│   └── models.py          # Pydantic schemas
├── frontend/
│   ├── src/
│   │   ├── components/    # React UI components
│   │   └── App.tsx
│   └── vite.config.ts
└── README.md
```

*(Adjust to match your actual folder layout.)*

## Roadmap

- [ ] Expand the reference dataset beyond 50 certifications and 20 red flags
- [ ] Add source citations for each rating
- [ ] Support batch analysis of full product pages
- [ ] Deploy a public demo

## Hackathon Submission

This project was built solo over a 7-day development cycle, with a focus on building a robust, real-world Generative AI application that prioritizes accuracy and truthfulness over creative guessing.

## Author

Developed with ❤️ by **Mehak Nasir**