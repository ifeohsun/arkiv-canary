# Friction report — building on Arkiv (Tiramisu), Oct 2026

Specific, reproducible notes from building CROPS Canary with `@arkiv-network/sdk@0.8.1`, Node 20.

1. **Faucet can't be used headless.** `GET/POST https://hub.arkiv.network/api/faucet` returns
   `{"error":"Unauthorized"}` without a wallet session, and a captcha token is also needed. CI and agent workflows
   can't fund a fresh test key. Suggestion: a rate-limited faucet that works per address, or a funded CI key for hackathons.
2. **README says Node ≥ 22.10** for `--experimental-strip-types`, but the plain `.mjs` ESM build works fine
   on Node 20. Saying so would save people from upgrading.
3. **The README example key** (`0x3d05…7a5e`) is shared and often empty. With a 0 balance, `createEntity`
   only fails with a generic insufficient-funds RPC error. A pre-flight balance check in `createWalletClient` would help.
4. **Expiry semantics are well documented in the type docs** (extend *sets* the new expiry, it doesn't add to the old one). This was
   the key feature for us, but it only appears in `.d.ts` JSDoc, not in the README.
5. **`where([...])` with an array of predicates** works, but the README only shows a single `eq`.
   One AND example would help.
6. **Payload helpers:** `jsonToPayload` and `entity.toJson()` are symmetric and nice. `toJson()` throws on a
   non-JSON payload, so readers have to wrap it in try/catch when they scan public entities written by others.
