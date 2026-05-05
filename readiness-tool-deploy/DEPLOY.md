# Deploying the SETA-ED Inclusive R&D Readiness Tools

This folder contains a complete, deploy-ready package: two interactive HTML tools (venture self-assessment and funder due-diligence rubric) plus a small serverless function that powers the AI-driven R&D Readiness Analysis. Deploying takes about 10 minutes the first time.

## What's in this folder

- `public/index.html` — landing page with links to both tools
- `public/self-assessment.html` — venture self-assessment (no AI, fully client-side)
- `public/diligence-rubric.html` — funder due-diligence rubric (uses `/api/analyze` for AI scoring)
- `api/analyze.js` — Vercel/Node serverless function that proxies to the Anthropic API
- `package.json` — declares the `@anthropic-ai/sdk` dependency
- `vercel.json` — routing/header config for Vercel

## What you need before deploying

1. An **Anthropic API key**. Get one at <https://console.anthropic.com>. The R&D Readiness Analysis uses Claude Haiku 4.5, which is inexpensive — analyzing a typical proposal costs about $0.05–$0.10.
2. A **Vercel account** (free tier is sufficient). Sign up at <https://vercel.com> using your GitHub/GitLab/email.
3. **Node.js 18+** installed locally if you want to use the Vercel CLI (or you can deploy via the web UI without installing anything).

## Option A — Deploy via the Vercel web UI (easiest, no command line)

1. Zip this entire folder (`readiness-tool-deploy/`).
2. Go to <https://vercel.com/new> and drag-drop the zip.
3. When Vercel asks for environment variables, add:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** your API key from step 1 above
4. Click **Deploy**. After 1–2 minutes you'll get a URL like `https://setaed-readiness-tools.vercel.app`.
5. Share that URL with Cameron.

## Option B — Deploy via the Vercel CLI

```bash
# from inside this folder
npm install -g vercel
vercel login              # one-time
vercel link               # one-time, links this folder to a Vercel project
vercel env add ANTHROPIC_API_KEY production   # paste your API key when prompted
vercel deploy --prod
```

The final command prints the production URL. Send that URL to Cameron.

## After deployment — verify it works

1. Open your deployment URL. You should see the landing page.
2. Click **Open diligence rubric**.
3. Go to the **R&D Readiness Analysis** tab.
4. Paste a sample proposal (you can use any of your V10 proposal text). Click **Run R&D Readiness Analysis**.
5. After 20–60 seconds, the analysis should complete and a new venture should appear with all 57 rubric questions scored and a populated risk plan.

If you get an error like "Server is missing ANTHROPIC_API_KEY", the env var didn't take effect — re-add it in the Vercel dashboard under Settings → Environment Variables, then redeploy.

## Custom domain (optional)

If you want this on `tools.seta-ed.com` or `readiness.seta-ed.com`:

1. In the Vercel dashboard, open your project → Settings → Domains.
2. Add the subdomain you want.
3. Vercel will give you a DNS record to add at your domain registrar (whoever hosts seta-ed.com).
4. After DNS propagates (usually within an hour), the tool is live on your custom domain.

## Cost expectations

- **Vercel hosting:** Free tier covers everything you need here (100GB bandwidth, 100 serverless invocations/day on Hobby tier; more on paid tiers).
- **Anthropic API:** Roughly $0.05–$0.10 per proposal analyzed. A 100-proposal review cycle costs $5–$10. Set a usage cap in the Anthropic console if you want a hard ceiling.

## Privacy notes for users

The diligence-rubric tool tells users explicitly:

> The R&D Readiness Analysis is run by a language model executing the SETA-ED rubric. Proposal text is processed in real time and not retained beyond the venture's local record in this browser.

This is accurate for the deployed configuration — proposal text is sent to Anthropic for analysis but is not stored on the SETA-ED server (the serverless function is stateless), and venture data persists only in the user's browser via `localStorage`.

If NSVF wants to use the tool for confidential or pre-public proposals, you may want to:
- Add a simple password gate to the deployment (Vercel Password Protection on Pro plans, or a basic-auth layer in the serverless function)
- Document the data flow in a one-page privacy memo for their compliance team

## Troubleshooting

**"Server returned 500: ..."** — usually means the API key is wrong, missing, or has been revoked. Check Vercel env vars and the Anthropic console.

**"Server returned 413"** — the proposal text is too long. The current cap is 250K characters; very long proposals should be trimmed (e.g., remove appendices) before submission.

**Analysis runs but returns blank scores** — Claude returned a malformed JSON response. The artifact already handles this gracefully (skipped fields show as 0). Re-running usually works. If it persists, check the browser console for the raw response.

**The self-assessment works but the diligence rubric doesn't** — the self-assessment is purely client-side and never calls the API. If only the diligence rubric is failing, the issue is in the API/serverless function, not the static hosting.

---

Questions? Email melina@seta-ed.com.
