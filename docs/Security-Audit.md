# Security Audit Report — Siva Sai Products
**Perspective: Cybersecurity Expert (20 Years Experience)**
**Date: May 2026 | Classification: Internal Use Only**

---

## Executive Summary

This audit covers the Siva Sai Products web application built on Next.js 16 + Payload CMS 3 + PostgreSQL (Supabase). The application is primarily a lead-generation/enquiry platform with a CMS admin panel. It handles moderately sensitive data: customer contact information (name, mobile, email) and business product data.

**Overall Risk Level: MEDIUM**

The application has a reasonable security baseline but has several gaps that need immediate attention before production deployment, particularly around rate limiting, the exposed seed endpoint, and environment variable handling.

---

## 1. Authentication & Authorization

### Payload CMS Authentication
| Check | Status | Risk |
|-------|--------|------|
| Admin login is protected by Payload's auth system | ✅ Pass | — |
| Passwords are hashed (bcrypt via Payload) | ✅ Pass | — |
| JWT-based sessions | ✅ Pass | — |
| `sameSite: 'Lax'` on auth cookies | ✅ Pass | — |
| Admin routes require authentication | ✅ Pass | — |
| Token expiry configured | ⚠️ Check | Medium |

### Access Control on Collections
| Collection | Create | Read | Update | Delete |
|------------|--------|------|--------|--------|
| Products | Admin only | Public (API) | Admin only | Admin only |
| Enquiries | Public (form) | Admin only | Admin only | Super Admin only |
| Users | Admin only | Admin only | Admin only | Admin only |
| Media | Admin only | Public | Admin only | Admin only |

**Assessment:** ✅ Access control is properly defined with role-based restrictions on Enquiries.

### Gaps Found
1. **No multi-factor authentication (MFA)** — Admin panel has no 2FA. For a single-admin CMS, a compromised password means full site control.
   - **Recommendation:** Implement TOTP-based 2FA or use a Cloudflare Access layer in front of `/admin`.

2. **Super Admin role check is fragile** — `(req.user as { role?: string }).role === 'super_admin'` — the `role` field is not in the Users collection schema.
   - **Recommendation:** Add `role` field to Users collection with proper type.

3. **Default admin user has no forced password change** — If the seed creates an admin with a weak password, there's no policy to change it.

---

## 2. Input Validation & Injection

### Enquiry API (`/api/enquiry`)
Validation includes:
- Name: minimum 2 characters
- Mobile: Indian 10-digit format regex
- Email: RFC format check
- Honeypot: `_hp` must be empty

**SQL Injection:** ✅ Not possible — Payload uses parameterized queries via the pg adapter. No raw SQL queries found.

**NoSQL Injection:** N/A — No MongoDB or NoSQL.

**XSS (Cross-Site Scripting):**
- React's JSX auto-escapes output ✅
- Rich text content (blog posts) rendered via custom `BlogContent` component — uses `node.text` directly in JSX which is auto-escaped ✅
- No `dangerouslySetInnerHTML` found ✅

**SSTI (Server-Side Template Injection):** N/A — No template engine.

### Gaps Found
4. **No maximum length validation on enquiry fields** — A user can submit a `name` field with 10MB of text.
   - **Recommendation:** Add `maxLength` checks to all enquiry fields.

5. **`_hp` honeypot is client-side only** — The honeypot check is validated server-side (good), but there's no timing check.
   - **Recommendation:** Add a minimum submission time check (< 3 seconds = likely bot).

---

## 3. API Security

### `/api/enquiry` (POST)
| Check | Status | Notes |
|-------|--------|-------|
| Input validation | ✅ Pass | Good client + server validation |
| Honeypot anti-spam | ✅ Pass | `_hp` field checked |
| Rate limiting | ❌ FAIL | **No rate limiting implemented** |
| CORS | ✅ Pass | Next.js same-origin by default |
| IP capture | ✅ Pass | IP stored for audit trail |
| Referrer capture | ✅ Pass | |

### `/api/seed` (POST) — CRITICAL
| Check | Status | Notes |
|-------|--------|-------|
| Protected by PAYLOAD_SECRET | ✅ Pass | Bearer token check |
| Should be removed in production | ❌ FAIL | **Exposes admin data creation** |

### Payload REST API (`/api/*`)
| Check | Status | Notes |
|-------|--------|-------|
| Collections respect access control | ✅ Pass | |
| No sensitive data in public GET | ✅ Pass | |
| Admin credentials not exposed | ✅ Pass | |

### Critical Gaps Found

6. **NO RATE LIMITING ON `/api/enquiry`** — This is the most critical vulnerability.
   - Without rate limiting, the endpoint is vulnerable to:
     - Spam submissions (filling your Enquiries table with junk)
     - DoS via database exhaustion
     - Credential stuffing if ever extended to auth
   - **Recommendation:** Implement Upstash Redis rate limiting:
   ```ts
   import { Ratelimit } from '@upstash/ratelimit'
   import { Redis } from '@upstash/redis'
   // 5 requests per 10 minutes per IP
   const ratelimit = new Ratelimit({ redis: Redis.fromEnv(), limiter: Ratelimit.slidingWindow(5, '10m') })
   ```

7. **`/api/seed` MUST be removed before production** — Even though it's protected by PAYLOAD_SECRET, the endpoint should not exist in production. It creates all categories/products and could be misused to flood the database.

---

## 4. Content Security Policy (CSP)

Current CSP in `next.config.ts`:
```
default-src 'self'
script-src 'self' 'unsafe-inline' 'unsafe-eval'
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com
font-src 'self' https://fonts.gstatic.com
img-src 'self' data: blob: https://res.cloudinary.com https://images.unsplash.com https://plus.unsplash.com
connect-src 'self' https://res.cloudinary.com
frame-src https://www.google.com
media-src 'self'
```

| Directive | Assessment |
|-----------|------------|
| `script-src 'unsafe-inline'` | ⚠️ Medium risk — needed for Next.js but weakens XSS protection |
| `script-src 'unsafe-eval'` | ⚠️ Medium risk — needed for development, should be removed in production |
| `img-src` | ✅ Good — only allows known domains |
| `frame-src` | ✅ Good — only Google (for maps) |

8. **`unsafe-eval` should be removed in production** — Only needed for development HMR.
   - **Recommendation:** Add environment check:
   ```ts
   ...(process.env.NODE_ENV === 'production' ? [] : ["'unsafe-eval'"]),
   ```

9. **`localhost` added to `remotePatterns`** — This should be conditional on dev environment:
   ```ts
   ...(process.env.NODE_ENV === 'development' ? [{ protocol: 'http', hostname: 'localhost' }] : []),
   ```

---

## 5. Environment Variable Security

| Variable | Exposure Risk | Current Status |
|----------|---------------|----------------|
| `DATABASE_URI` (contains password) | Server-only | ✅ No NEXT_PUBLIC_ prefix |
| `PAYLOAD_SECRET` | Server-only | ✅ No NEXT_PUBLIC_ prefix |
| `CLOUDINARY_API_SECRET` | Server-only | ✅ No NEXT_PUBLIC_ prefix |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only | ✅ No NEXT_PUBLIC_ prefix |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public (by design) | ✅ Anon key is safe to expose |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Public | ✅ Safe to expose |

10. **`DATABASE_URI` contains plaintext password** — The password `V@@luchell@m@91` is URL-encoded in the connection string. If `.env.local` is accidentally committed, the database is fully compromised.
    - **Recommendation:** Verify `.env.local` is in `.gitignore` (currently is ✅). Add a pre-commit hook to scan for database URIs.

11. **`PAYLOAD_SECRET` is weak in development** — `siva-sai-dev-secret-key-minimum-32-chars-ok` is human-readable and predictable.
    - **Recommendation:** Use a cryptographically random secret even in development:
    ```bash
    node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
    ```

12. **`.env.local` is gitignored** ✅ — Verified. Contains all secrets. Do not commit.

---

## 6. CORS & CSRF

### CORS Configuration
```ts
cors: ['http://localhost:3000', appURL]
```
- ✅ Restricts CORS to same origin — correct
- ⚠️ If `appURL` is empty string (env var not set), CORS allows localhost only — acceptable for dev, needs verification in production

### CSRF Protection
- Payload uses JWT cookies with `sameSite: 'Lax'` — protects against most CSRF for admin actions
- Public POST to `/api/enquiry` has no CSRF token — acceptable since it's a public form, but honeypot + rate limiting should compensate

---

## 7. Data Privacy & Compliance

### Data Collected
| Data Type | Collection Point | Storage |
|-----------|-----------------|---------|
| Name | Enquiry form | Supabase (India-ish region) |
| Mobile number | Enquiry form | Supabase |
| Email | Enquiry form | Supabase |
| IP address | Server-captured | Supabase |
| Referrer URL | Server-captured | Supabase |

### Compliance Gaps

13. **No Privacy Policy page** — Collecting name, mobile, email and IP address requires a privacy policy under Indian DPDP Act 2023.
    - **Recommendation:** Create `/privacy-policy` page.

14. **No Terms of Service** — B2B wholesale requires clear terms.

15. **IP address stored without user consent disclosure** — The user submitting the enquiry form is not informed that their IP is captured.
    - **Recommendation:** Add a note: "By submitting, you agree to our Privacy Policy."

16. **No data retention policy** — Enquiries are stored indefinitely with no automated purging.
    - **Recommendation:** Archive/delete enquiries older than 2 years.

---

## 8. Third-Party Dependencies

### Dependency Audit
```
Total dependencies: ~25 direct
```

| Package | Risk | Notes |
|---------|------|-------|
| `payload@3.80.0` | Low | Actively maintained |
| `next@16.2.1` | Low | Actively maintained |
| `@supabase/supabase-js` | Low | Maintained by Supabase |
| `cloudinary@2.9.0` | Low | Stable, no known CVEs |
| `sharp@0.34.5` | Medium | Image processing — watch for CVEs |
| `react@19.2.4` | Low | Latest React |
| `framer-motion@12.38.0` | Low | UI library only |

17. **Run `npm audit` before production** — Scan for known CVEs in current dependencies.

---

## 9. Supabase / Database Security

18. **Supabase project was paused and resumed** — This suggests the project may be on a Free tier. Free tier projects auto-pause after 7 days of inactivity.
    - **Recommendation:** Upgrade to Pro tier for production to avoid downtime.

19. **`rejectUnauthorized: false` in SSL config** — The database connection uses `ssl: { rejectUnauthorized: false }`. This disables SSL certificate verification, making the connection vulnerable to MITM attacks.
    - **Recommendation:** Use proper Supabase SSL certificate:
    ```ts
    ssl: {
      rejectUnauthorized: true,
      ca: fs.readFileSync('prod-ca-2021.crt').toString()
    }
    ```
    *(The `prod-ca-2021.crt` file already exists in the project root)*

20. **Direct DB connection (port 5432) used instead of pooler** — The connection was switched to port 5432 after pooler issues. For serverless (Vercel), use the pooler (port 6543) to prevent connection exhaustion.
    - **Recommendation:** Switch back to pooler once it's stable, using `pgbouncer=true&connection_limit=1` for serverless.

---

## 10. Security Remediation Priority

### P0 — Fix Before Launch
| # | Issue | Effort |
|---|-------|--------|
| 6 | Add rate limiting to `/api/enquiry` | 2h |
| 7 | Remove `/api/seed` endpoint in production | 30m |
| 19 | Enable SSL certificate verification | 1h |
| 20 | Switch to connection pooler for Vercel | 1h |

### P1 — Fix Within 2 Weeks
| # | Issue | Effort |
|---|-------|--------|
| 1 | Add MFA to admin panel | 4h |
| 4 | Add max length validation on enquiry fields | 1h |
| 8 | Remove `unsafe-eval` from production CSP | 30m |
| 9 | Make localhost remotePatterns dev-only | 30m |
| 13 | Add Privacy Policy page | 2h |

### P2 — Fix Within 1 Month
| # | Issue | Effort |
|---|-------|--------|
| 2 | Add `role` field to Users collection | 1h |
| 5 | Add timing check to honeypot | 2h |
| 11 | Strengthen PAYLOAD_SECRET | 30m |
| 14 | Add Terms of Service page | 2h |
| 15 | Add privacy disclosure to enquiry form | 30m |
| 17 | Run `npm audit` and patch CVEs | 2h |

---

## Conclusion

The application follows modern security practices for its framework choices and has a clean, well-structured codebase. The most critical issues are operational (rate limiting, SSL, connection pooler) rather than code-level vulnerabilities. Addressing the P0 items before launch will bring the security posture to an acceptable level for a B2B lead generation website. Post-launch, MFA and compliance work (Privacy Policy, DPDP Act) should be prioritized.
