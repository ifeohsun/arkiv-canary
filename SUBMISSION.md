# Devfolio submission: CROPS Canary

**Project name:** CROPS Canary
**Tagline:** Self-expiring, signed warrant canaries on Arkiv. If they're not renewed, they die on their own, and nobody can quietly edit them.
**Links:** repo https://github.com/ifeohsun/arkiv-canary · live https://ifeohsun.github.io/arkiv-canary/ · demo video <VIDEO_URL>
**Tracks:** Censorship Resistance (primary), Privacy

**The problem it solves\***
Newsrooms, VPN and email providers, and open-source maintainers publish warrant canaries ("we have received no secret orders").
Today they sit on the publisher's own website, which can be silently edited, taken down, or kept up under duress. Readers can't tell
"the canary died" apart from "the site is down" or "it was updated by force". CROPS Canary stores each signed statement as an Arkiv entity with
Entity Expiration. A canary is alive only while a fresh entity exists, and stopping renewal makes it disappear network-wide with no action by anyone.
Any reader can verify the signature against the immutable $creator.

**Challenges I ran into\***
The faucet couldn't be used headless (see friction.md #1). Learning Entity Expiration semantics from the .d.ts files. `expiresAt` comes back as a block number.
Designing the schema so "dead" needs no action (absence = dead) while "withdrawn" stays an explicit signal.

1. **Live app URL\*:** https://ifeohsun.github.io/arkiv-canary/
2. **Indian nationality\*:** No
3. **Why Arkiv?\***
   - Entity Expiration *is* the dead-man's switch. With Postgres or our own API, the operator runs the expiry and can be compelled to keep a stale canary "alive" or to delete it.
   - IPFS content can't express "this is no longer true". Pinning just stops, and readers can't tell that apart from a pin outage.
   - A subgraph indexes events forever and has no native expiry.
   - Arkiv gives attribute queries without running an indexer, a tamper-evident write history, and an immutable $creator, so readers verify the publisher with no trusted host.
   - Kept off Arkiv on purpose: keys, personal data, the UI and alert state.
4. **How do you use Arkiv?\***
   - `createEntity` with attributes app/org/seq/withdrawn and a signed JSON payload (https://github.com/ifeohsun/arkiv-canary/blob/main/src/arkiv.mjs).
   - `ExpirationTime.fromDays(validDays)` gives the canary's validity window, i.e. automatic death (https://github.com/ifeohsun/arkiv-canary/blob/main/src/arkiv.mjs).
   - `select().where([eq("app"), eq("org")])` with async-iterator pagination is used by the CLI and the browser viewer (https://github.com/ifeohsun/arkiv-canary/blob/main/scripts/list.mjs, https://github.com/ifeohsun/arkiv-canary/blob/main/index.html).
   - `$creator` is compared against the EIP-191 signer (https://github.com/ifeohsun/arkiv-canary/blob/main/src/canary.mjs).
   - Newest seq wins, sorted on the client because there is no orderBy.
5. **Friction report\*:** https://github.com/ifeohsun/arkiv-canary/blob/main/arkiv/friction.md
6. **Wallet addresses\*:** `0x27440d0125f0F49FFfe3aF16d2FcB566aDEf841A`, the publisher/creator of all demo canary entities (orgs demo-newsroom and demo-vpn). See https://github.com/ifeohsun/arkiv-canary/blob/main/DEPLOYMENTS.md
7. **schema.md\*:** https://github.com/ifeohsun/arkiv-canary/blob/main/arkiv/schema.md
8. **Reproduce\***
   (a) Open https://ifeohsun.github.io/arkiv-canary/. It should show demo-newsroom ALIVE, demo-vpn WITHDRAWN, and 4 entities with ✅.
   (b) `git clone https://github.com/ifeohsun/arkiv-canary && cd arkiv-canary && npm install && node scripts/list.mjs`
   (c) Exact query: `select({key,owner,creator,payload,expiresAt}).where([eq("app","crops-canary"), eq("org","demo-newsroom")])`
   (d) Publish your own with a funded key: `TIRAMISU_PRIVATE_KEY=0x… node scripts/publish.mjs my-org 1 "No secret orders." 1`. After the 1-day expiry, list shows `my-org dead`.
   (e) `npm test` runs the offline sign/verify/status tests.
9. **Pre-existing work\*:** None. Built 14–18 Oct 2026. Dependencies: @arkiv-network/sdk, viem.
10. **Arkiv surfaces used\*:** TypeScript SDK, Direct JSON-RPC (block time check), Docs, Hub, Faucet, Block Explorer
12. **First entity written\*:** 2 hours or less
13. **LLMs used\*:** AI coding agent (Grok Bot); all code reviewed and run by the builder
14. **One thing to improve first\*:** a faucet that works headless or from the CLI for test wallets, so agents and CI can build on Arkiv
15. **Feedback call\*:** Yes
16. ✅  17. ✅  18. No
