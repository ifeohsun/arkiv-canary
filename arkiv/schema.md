# Arkiv schema — CROPS Canary

One entity type: **canary statement**. Each renewal is a new entity; old ones expire on their own.

| Field | Kind | Type | Example | Why |
|---|---|---|---|---|
| `app` | attribute | str | `crops-canary` | Namespace for queries (`eq("app","crops-canary")`) |
| `org` | attribute | str (slug) | `demo-newsroom` | Look up one publisher's canaries |
| `seq` | attribute | i32 | `3` | Monotonic sequence number; newest wins |
| `withdrawn` | attribute | str `yes`/`no` | `no` | Explicit withdrawal (the "dead" signal without waiting) |
| payload | JSON | `application/json` | `{org,seq,issued,validDays,statement,headline,signer,signature,withdrawn}` | Full signed statement |
| Entity Expiration | entity lifetime | `ExpirationTime.fromDays(validDays)` | 7 days (demo: 30) | **The core mechanic**: when it isn't renewed, the canary disappears from Arkiv and readers see DEAD |
| creator/owner | system | address | `0x2744…841A` | Must equal the EIP-191 signer in the payload |

## Signature
`signature = personal_sign(canonical(payload))`, where `canonical` is the fixed newline-joined text in
`src/canary.mjs`. Readers verify that the signer recovered from the signature equals the entity's creator.

## What is deliberately NOT on Arkiv
- Private keys, real names, and personal data. The demo uses synthetic orgs only.
- Any secret orders themselves. The canary only says that none exist.
- The UI (a static page on GitHub Pages) and alerting state.

## Queries used
- `select({key,owner,creator,payload,expiresAt}).where([eq("app","crops-canary"), eq("org", org)])`
- `select(...).where(eq("app","crops-canary"))`, which lists every live canary

## Expiration per entity type
| Entity type | Expiration | Renewal |
|---|---|---|
| canary statement | `validDays` chosen by publisher (default 7, demo 30) | publish a new seq. Old ones expire on their own, so there is no Lifetime Extension of old statements on purpose |

## Trust
Readers trust `$creator` (immutable), never `$owner`. The EIP-191 signer must equal the creator.
