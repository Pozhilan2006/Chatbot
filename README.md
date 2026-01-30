# AI Web3 Assistant

A production-ready secure SaaS application for AI-powered blockchain interactions.

## Prerequisites
- Node.js (v18+)
- MetaMask Wallet Extension

## Project Structure
- `/frontend`: Next.js App Router, Tailwind CSS, Ethers.js
- `/backend`: Node.js, Express, OpenAI Integration

## Getting Started

### 1. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in `backend/` (or edit the existing one) and add your OpenAI API Key:
```env
PORT=3001
LLM_API_KEY=your-openai-api-key-here
LLM_API_URL=https://api.openai.com/v1
LLM_MODEL=gpt-4o
```

Start the backend server:
```bash
npm run dev
```
Server runs on http://localhost:3001

### 2. Frontend Setup
Navigate to the frontend directory and install dependencies:
```bash
cd frontend
npm install
```

Start the frontend development server:
```bash
npm run dev
```
App runs on http://localhost:3000

## Usage
1. Open http://localhost:3000
2. Connect your MetaMask wallet.
3. You will be redirected to the Chat Interface.
4. Type a request like "Send 0.001 ETH to 0x123...".
5. The AI will parse your intent and present a secure confirmation modal.
6. Confirm execution in your wallet.

## Security Features
- **No Private Keys Stored**: Private keys never leave your wallet.
- **Strict Intent Parsing**: The backend only returns JSON intent; it cannot execute transactions.
- **User Confirmation**: All critical actions require explicit approval via the UI modal and your wallet.
- **Risk Analysis**: High-value or ambiguous requests are flagged.
