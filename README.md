# PULSE Command

### **Predict. Coordinate. Protect.**
> AI-powered stadium operations intelligence for FIFA World Cup 2026 matchdays.

---

## 📌 Project Overview
**PULSE Command** is a stadium operations intelligence and coordination platform designed for the FIFA World Cup 2026 matchday operations challenge. Unlike simple fan chatbots, **PULSE Command** acts as the central decision-support layer fusing disjointed matchday telemetry—gate scan rates, queue wait times, transit platform occupancy, weather conditions, and fan incident reports—into a unified, real-time coordination picture. 

By utilizing specialist AI agents and an human-in-the-loop orchestrator, the platform generates ranked, actionable proposals for operational leads while synchronizing tasks to volunteers in the field and pushing safety alerts to fans.

*Disclaimer: This is an independent, non-affiliated challenge project inspired by the FIFA World Cup 2026 stadium operations use case. It does not use official FIFA trademarks, logos, or brand assets, and makes no claim of official affiliation.*

---

## 👥 Roles & User Journeys

The platform features three role-based interfaces sharing a unified real-time data state:

1. **Operations Supervisor (Aisha — Command Center `/command`)**: Monitors the stadium's live telemetry map and raw intel feed. Aisha reviews conflict-resolved AI recommendations and approves or rejects proposals with one tap.
2. **Volunteer steward (Marcus — Volunteer App `/volunteer`)**: Marcus views a sunlight-optimized, high-contrast task dispatch queue. He can accept or mark tasks as completed in the field under pressure.
3. **Attendee (Priya — Fan App `/fan`)**: Priya monitors gate wait times, visual wayfinding maps, submits incident reports (medical, lost child, facilities, accessibility), and receives urgent multilingual alerts.

---

## ⚙️ Architecture & Data Flow

PULSE Command's real-time coordination loop operates as follows:

```
[Fan Incident Report] ──┐
                         v
[Simulator Telemetry] ───> [Specialist Agents] ───> [Orchestrator] ───> [Command Center]
                                                                                │
                                                                         (Human Approval)
                                                                                │
[Fan Portal Alerts] <──── [Firebase RTDB Real-Time Sync] <─── [Volunteer Dispatch Tasks]
```

1. **Data Ingestion**: The synthetic simulator streams events (`gate_throughput`, `zone_density`, `transit_occupancy`, `incident_report`) to the Command Center SSE endpoint. Fans can also submit real-time incidents.
2. **Specialist Agents**: Ingested events are routed to AI specialist agents:
   - **Crowd-flow**: Analyzes throughput and stand densities to predict congestions 15-30 minutes ahead.
   - **Dispatch**: Matches available volunteers by zone and skill to active incidents.
   - **Transit**: Monitors post-match egress and transport queue capacities.
   - **Comms**: Translates alerts to Spanish, French, and English with appropriate urgency.
3. **Orchestrator**: Resolves conflicting specialist proposals, ranks them by operational urgency, and presents them in a unified decision queue.
4. **Human Approval**: The supervisor reviews proposals (confidence, reasoning, impact). **No action takes effect autonomously.**
5. **Real-time Synchronization**: Approved actions are synchronized in real-time to the Volunteer and Fan portals using a Firebase Realtime Database SSE stream.

---

## 🛠️ Local Setup & Environment Variables

### Prerequisites
- Node.js (v18+)
- npm

### 1. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Fill in your configuration:
- `GEMINI_API_KEY`: Get your API key from [Google AI Studio](https://ai.google.dev/). (If no key is provided, the platform automatically falls back to a context-aware mock agent pipeline for local-only testing).
- `NEXT_PUBLIC_FIREBASE_DB_URL`: Your Firebase Realtime Database URL (e.g. `https://your-project-id.firebaseio.com/`).

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open the following tabs in your browser:
- Command Center: `http://localhost:3000/command`
- Volunteer Portal: `http://localhost:3000/volunteer`
- Fan Portal: `http://localhost:3000/fan`

---

## 💻 CLI Commands

- **Start Development**: `npm run dev`
- **Verify Linter Rules**: `npm run lint`
- **Run Production Build**: `npm run build`
- **Start Production Build**: `npm run start`

---

## 🛡️ Security & Demo Safeguards
- **No Client Keys**: All AI reasoning and Firebase write operations are handled securely server-side.
- **Input Validation**: All incoming API requests undergo structural validation (bounds, lengths, schemas) to prevent malformed injections.
- **Deduplication Check**: Store actions filters duplicate event IDs to prevent duplicate proposals or events.
- **Heuristic Fallback**: A local heuristic pipeline handles all decision support when network or AI quotas fail.
