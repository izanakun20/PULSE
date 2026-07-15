# StadiumOPS

### **GenAI Matchday Intelligence Platform**
> AI-powered matchday intelligence for fans, volunteers, and operations teams during the FIFA World Cup 2026.

---

## 📌 Product Positioning

**StadiumOPS** is a unified, real-time coordination ecosystem powered by **StadiumIQ** — a context-aware reasoning engine. Instead of functioning as a passive dashboard, StadiumOPS uses specialized AI agents and a human-supervised orchestrator to proactively manage crowd flow, coordinate volunteers, broadcast safety guidelines, and log matchday incidents.

The platform provides role-based interfaces designed around AI assistance:

1. **Operations Center (`/command`)**: Monitors AI-generated recommendations, approves operational dispatches, and supervises crowd patterns.
2. **Volunteer Portal (`/volunteer`)**: Marcus Chen and other stewards receive sunlight-optimized, walkie-talkie-style task logs generated directly by the AI.
3. **Fan Companion (`/fan`)**: Attendee Priya receives proactive AI wait-time advisories, multilingual alerts, and wayfinding routes.

---

## 🧠 AI Reasoning Workflow

StadiumOPS operates on a complete end-to-end AI reasoning workflow visible throughout the interfaces:

```
[Sensor Alert / Fan Incident]
             ↓
[StadiumIQ Specialist Agents Analyze Data]
             ↓
[Orchestrator Resolves Conflicts & Ranks Proposals]
             ↓
[Human Operator Approves or Overrides AI Proposal]
             ↓
[Volunteer Task Dispatched] ─── AND ─── [Multilingual Fan Alert Pushed]
             ↓
[StadiumIQ Logs Action & Updates Seating Heatmap]
```

Every recommendation presented by StadiumIQ details:
- **Situation**: Raw sensor telemetry trigger.
- **Reasoning**: Contextual analysis based on historical patterns.
- **Confidence**: Structured probability level.
- **Predicted Impact**: Projected crowd-relief benefits.
- **Alternative Options**: Fallback manual procedures.

---

## 🚀 Key AI Capabilities

- **Venue Navigation**: Real-time entry guidance, restroom suggestions, and concessions routing.
- **Crowd Intelligence**: Predicts sector overcrowding and optimizes gate ingress rates.
- **Accessibility Support**: Assisting disabled attendees with custom wheelchair routes.
- **Transportation Guidance**: Coordinating staggered exit releases to load-balance trains and buses.
- **Multilingual Support**: Translates operations broadcasts instantly into English, Spanish, and French.
- **Sustainability Management**: Monitoring recycling bin capacity and lighting loads.
- **Incident Response**: Rapid volunteer dispatches for safety hazards or medical calls.
- **Executive Reports**: Automated post-match operations summaries.

---

## ⚙️ Setup & Environment Variables

### 1. Configure Local Configuration
Copy `.env.example` to `.env.local` inside the workspace:
```bash
cp .env.example .env.local
```

Define variables:
- `GEMINI_API_KEY`: Get your key from [Google AI Studio](https://ai.google.dev/). (Defaults to context-aware mock generators if key is absent).
- `NEXT_PUBLIC_FIREBASE_DB_URL`: Firebase Realtime Database URL to enable real-time sync.

### 2. Launch Local Servers
```bash
npm install
npm run dev
```

Visit the routes:
- **Landing Portal**: `http://localhost:3000/`
- **Operations Center**: `http://localhost:3000/command`
- **Volunteer Portal**: `http://localhost:3000/volunteer`
- **Fan Companion**: `http://localhost:3000/fan`

---

## 💻 CLI Commands

- `npm run dev`: Start local development server.
- `npm run lint`: Run ESLint checks.
- `npm run build`: Compile static Next.js production bundle.
- `npm run test`: Run incident schema validation unit tests.

---

*Disclaimer: This is an independent challenge project inspired by the FIFA World Cup 2026. It makes no claim of official affiliation or endorsement.*
