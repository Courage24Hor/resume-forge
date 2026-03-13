# C-TECH AI Resume Builder (Ghana Market Optimized)

A full-stack, production-ready AI Resume Builder tailored for the Ghanaian job market. Features sequential multi-step wizard, AI-driven content generation, and native MoMo payment integration via Paystack.

## Features
- **MTN Mobile Money Ready**: Integrated with Paystack GHS payments.
- **AI Content Generator**: Uses OpenRouter models to generate impact-driven bullet points.
- **ATS-Optimized Preview**: Real-time CSS preview optimized for HR systems.
- **Supabase Auth**: Secure login with email/password.
- **Zustand State**: Persistent local storage for draft resumes.
- **Paywall Download Gate**: Monetized PDF download workflow.

## Prerequisites
- Node.js 18.x or higher
- Supabase project (Postgres + Auth)
- Paystack Account (Live or Test mode)
- OpenRouter API Key

## Setup Instructions

1.  **Clone the project** and navigate to the directory.
2.  **Install dependencies**:
    `npm install`
3.  **Environment Variables**:
    Create a `.env` file in the root based on `.env.example`:
    - Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
    - Set `SUPABASE_SERVICE_ROLE_KEY` for server-side auth updates.
    - Set `PAYSTACK_SECRET_KEY` from your Paystack dashboard.
    - Set `OPENROUTER_API_KEY` and `OPENROUTER_MODEL`.
    - Optional: `NEXT_PUBLIC_SITE_URL` for Paystack callback URL.
4.  **Database Setup**:
    Run `supabase/schema.sql` in the Supabase SQL editor.
5.  **Run Development Server**:
    `npm run dev`

6.  **Usage**:
    - Access `http://localhost:3000`
    - Navigate to `/builder`
    - Fill out your info and use the "Optimize with AI" buttons.
    - Reach the "Finish" step to see the MoMo payment gate.
    - Once paid (use Paystack test cards/numbers in dev), download your PDF.

## Project Structure
- `app/builder`: Main multi-step resume building logic.
- `app/api/payments`: Paystack initialization and verification webhooks.
- `hooks/use-resume-store.ts`: Central state management for the resume wizard.
- `components/resume-preview.tsx`: The visual layout of the PDF.
- `components/download-gate.tsx`: Paywall component focusing on Ghana's GHS pricing.

## Troubleshooting
- **Database Connection**: Ensure your Supabase project is running and reachable.
- **Paystack Redirects**: Ensure `NEXT_PUBLIC_SITE_URL` is set correctly in `.env` for the callback URL.
- **AI Failure**: Check if your OpenRouter account has sufficient credits and the API key is correct.
