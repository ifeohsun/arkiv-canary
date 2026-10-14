# Friction report: building CROPS Canary on Arkiv

Environment: `@arkiv-network/sdk@0.8.1`, `viem@2.38`, Node 20.19, Linux. Tiramisu testnet (chain 7738577), 14 Oct 2026.

### 1. Faucet: can't be used headless
- **Expected:** fund a fresh test key from a script or CI (`POST /api/faucet {recipient}`).
- **Actual:** `GET` and `POST https://hub.arkiv.network/api/faucet` both return `{"error":"Unauthorized"}` without a browser wallet session, and the POST also needs a `captchaToken`.
- **Repro:** `curl -X POST https://hub.arkiv.network/api/faucet -H 'content-type: application/json' -d '{"recipient":"0x…"}'`
- **Suggestion:** a rate-limited per-address faucet for hackathons, or document that the faucet is browser-only.

### 2. README says Node ≥ 22.10
- **Expected:** a modern Node is needed. **Actual:** the ESM build runs fine on Node 20.19 with plain `.mjs`. Only the `--experimental-strip-types` route needs 22.
- **Suggestion:** state the real minimum for JS users.

### 3. Unclear error with an empty wallet
- **Expected:** a clear "insufficient balance" from `createEntity`. **Actual:** a generic RPC/viem error. The README's shared example key `0x3d05…7a5e` is often empty, so first-time users hit this.
- **Repro:** `createWalletClient` with an unfunded key, then `createEntity({...})`.
- **Suggestion:** an optional pre-flight balance check, or a mapped error message.

### 4. Entity Expiration / Lifetime Extension semantics only in `.d.ts`
- **Expected:** the README explains that `extendEntity` *sets* a new expiry (counted from now) and reverts if it is not later.
- **Actual:** this, the feature our whole design depends on, is only in JSDoc in `dist/*.d.ts`.
- **Suggestion:** add a README section with an example.

### 5. AND queries are undocumented
- **Expected:** a README example of multiple predicates. **Actual:** only a single `eq()` is shown. `where([eq("app",…), eq("org",…)])` works, but we found it by trial.
- **Versions:** SDK 0.8.1. **Repro:** `scripts/list.mjs demo-newsroom`.

### 6. `expiresAt` is a block number
- **Expected:** a date-like value (the type is `bigint | Date`). **Actual:** we get a block number (e.g. `1864256n`), so the UI has to fetch block time to show a human date.
- **Suggestion:** return or offer both block and an estimated timestamp.

### 7. `toJson()` throws on non-JSON payloads
- When scanning public entities written by others under the same attribute, one bad payload throws. We wrap it in try/catch (`src/arkiv.mjs`). A `safeJson()` / `tryJson()` would help.
