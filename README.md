# Quantum Atlas

A free guide to quantum computing in plain English, by Quantura Technologies. Lessons, quizzes, an in-browser circuit simulator, and a 3D model of a superconducting quantum computer.

Chapter text lives in `content/`. Each chapter is one `.qa` file, and `content/glossary.qa` is the glossary. The page loads those files in the browser. There is no compile step.

Progress is saved in the browser. Sign-in with an email code stores that same progress in Supabase so it follows the person to another device.

## Run locally

```powershell
npm install
copy .env.example .env
npm start
```

Open http://127.0.0.1:8080.

In `.env`, replace `[YOUR-PASSWORD]` in `DATABASE_URL` and set `SESSION_SECRET` to a long random string. To send codes, set `EMAIL_ADDRESS` (the real mailbox), `EMAIL_ALIAS` (the address learners see), and `EMAIL_APP_PASSWORD` (an app password for the real mailbox). The alias must be allowed to send as that mailbox. For Gmail, add it under Settings, Accounts, Send mail as. Leave `SMTP_HOST` blank to use `smtp.gmail.com`. For a local trial without email, set `OTP_DEBUG=1`. The code then appears on the sign-in form. Do not leave that on for a public site.

`python -m http.server 8080` still serves the lessons, quizzes, and 3D view. Sign-in needs `npm start`, because that process also runs the account API.

## Host on Vercel

Import this repository. Leave the framework as **Other** and the build command empty. The project root is the site. Vercel serves the files and runs `api/` as serverless functions.

In the Vercel project settings, add the same variables as `.env`:

- `DATABASE_URL` — use the pooler URI from Supabase **Connect**, not `db.<project>.supabase.co`. That direct host is IPv6-only, and Vercel cannot resolve it. The pooler user is `postgres.<project-ref>`. Copy the host from the dashboard, then redeploy.
- `SESSION_SECRET`
- `EMAIL_ADDRESS`, `EMAIL_ALIAS`, and `EMAIL_APP_PASSWORD`
- `SMTP_HOST` and `SMTP_PORT` when the mailbox is not Gmail

Do not set `OTP_DEBUG` on Vercel.

Routes inside the lessons are hash URLs (`#home`, `#hardware`, `#learn`). The service worker does not cache `/api/`.

## How learning progress works

- A chapter is complete only after every quiz question is answered correctly. Gates, Algorithms, and Programming also require a checked circuit in the simulator.
- Choose Curious beginner, Student, or Coder. Later chapters on that path stay visible and open after the previous check is passed.
- A wrong quiz answer is added to the review queue and comes back the next day. The streak counts quiz, review, puzzle, and circuit practice.
- Sign in from the main menu or the top bar. The saved record is chapters, quiz results, hands-on checks, the chosen path, XP and review state, the career checklist, and the saved circuit. The AI key in Settings stays on the device.
