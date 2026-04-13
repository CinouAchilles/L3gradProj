# AI Features Guide (Step by Step)

This document explains exactly how AI works in this project.

## 1) What AI features exist now

- Chat assistant for PC advice
- Compatibility/bottleneck analysis for selected parts
- Budget build generator
- Approve and add AI suggested build to cart

## 2) Backend flow

### 2.1 API routes

File: `backend/routes/ai.routes.js`

- `POST /api/ai/chat`
- `POST /api/ai/compatibility`
- `POST /api/ai/build-plan`

### 2.2 AI controller

File: `backend/controllers/ai.controller.js`

Main exported handlers:

1. `chatWithAI`
- Inputs: `prompt`, optional `selectedProductIds`
- Loads product catalog from MongoDB
- Builds compact catalog context
- Sends system + user messages to Groq model
- Returns AI text reply and selected part summaries

2. `checkCompatibility`
- Inputs: `selectedProductIds`
- Loads selected products from MongoDB
- Asks model to evaluate compatibility and bottleneck risk
- Returns AI text reply and selected part summaries

3. `createBuildPlan`
- Inputs: `budget`, optional `purpose` (`gaming`, `balanced`, `productivity`)
- Uses simple category budget split logic to pick parts from current catalog
- Asks model to summarize plan + caveats
- Returns selected parts, totals, and `selectedProductIds` for cart approval

### 2.3 AI provider service

File: `backend/services/groq.js`

- Single function: `generateChatCompletion(messages, options)`
- Sends chat completion request to Groq OpenAI-compatible endpoint
- Requires `GROQ_API_KEY` in environment

### 2.4 Catalog helper

File: `backend/services/aiCatalog.js`

- `normalizeCategory(product)`
  - Maps product text/category to normalized part types
- `buildCatalogContext(products)`
  - Creates compact product context sent to AI model

## 3) Frontend flow

### 3.1 Main AI widget

File: `frontend/src/components/common/AIAssistantWidget.jsx`

Widget features:

1. Ask AI
- Sends `prompt` and current cart product IDs to `/api/ai/chat`

2. Check cart compatibility
- Sends cart product IDs to `/api/ai/compatibility`

3. Generate budget build
- Sends `budget` and `purpose` to `/api/ai/build-plan`
- Stores returned `selectedProductIds` in local state for approval

4. Approve and add to cart
- Calls `addManyToCart(selectedProductIds)` from cart store

### 3.2 Widget mount point

File: `frontend/src/pages/home/Homelayout.jsx`

- `AIAssistantWidget` is mounted globally in layout so users can access it throughout the storefront.

### 3.3 Cart integration

File: `frontend/src/stores/useCartStore.jsx`

- `addManyToCart(productIds)`
  - Adds all approved AI product IDs to cart
  - Refreshes cart after completion

## 4) Data source and behavior

- AI always receives your store catalog context from database.
- AI uses model hardware knowledge + your in-store catalog.
- Current implementation does **not** perform real-time web browsing.

## 5) Request examples

### 5.1 Chat

`POST /api/ai/chat`

```json
{
  "prompt": "Is this build good for 1440p gaming?",
  "selectedProductIds": ["id1", "id2", "id3"]
}
```

### 5.2 Compatibility

`POST /api/ai/compatibility`

```json
{
  "selectedProductIds": ["id1", "id2", "id3"]
}
```

### 5.3 Build plan

`POST /api/ai/build-plan`

```json
{
  "budget": 200000,
  "purpose": "gaming"
}
```

## 6) Environment setup

Required backend env var:

- `GROQ_API_KEY`

Optional app env vars already used in server:

- `CLIENT_URL`
- `MONGO_URI`
- auth secrets

## 7) Known limits

- Compatibility and bottleneck checks are model-based (advice quality depends on model + product descriptions).
- If product descriptions are sparse, results can be less accurate.
- No live web search in this version.

## 8) How to test quickly

1. Start backend and frontend.
2. Open the store and click the AI widget button.
3. Ask a compatibility question.
4. Add some parts to cart, then click "Check cart compatibility".
5. Generate a budget build.
6. Click "Approve & Add ... parts to cart" and verify cart contents.
