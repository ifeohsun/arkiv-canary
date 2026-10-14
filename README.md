# 🐤 CROPS Canary — self-expiring warrant canaries on Arkiv

**Arkiv: Global Tour Stop** · Track: **Censorship Resistance** (also fits Privacy) · Tiramisu testnet (chain 7738577)

**Live viewer:** https://ifeohsun.github.io/arkiv-canary/ (static, reads Arkiv directly from the browser)

## Why this pillar
Journalists, VPN and email providers, and open-source maintainers publish *warrant canaries*: "we have received no
secret orders". Today these live on the publisher's own website, which can be silently edited, taken down,
or forced to stay up. Readers can't tell a canary that died from a site that went down, or from one updated under duress.

## Why Arkiv
- **Expiry is the dead-man's switch.** Each canary is an Arkiv entity with `expires = validDays`. If the
  publisher stops renewing, the entity disappears network-wide and every reader sees DEAD. On Postgres, IPFS or our own
  API, someone has to run the expiry and can be pressured to keep a stale canary "alive". On a subgraph, the data never expires.
- **Queryable by attribute** (`app`, `org`, `seq`), so any reader can build a viewer without an indexer.
- **Tamper-evident and censorship-resistant**: no single host can delete or edit a statement. EIP-191 signatures tie
  each statement to the creator address.
- Kept off Arkiv on purpose: keys, personal data, and UI state (see `arkiv/schema.md`).

## How it uses Arkiv
| Feature | Use |
|---|---|
| `createEntity` + attributes | publish signed canary (`app`, `org`, `seq`, `withdrawn`) |
| `ExpirationTime.fromDays` | the canary's validity window, which is how it dies automatically |
| `select().where([eq,eq])` + pagination | viewer and CLI list live canaries per org |
| `creator` field | readers check signer == creator |

## Run
```bash
npm install
npm test                                   # offline sign/verify/status tests
node scripts/list.mjs demo-newsroom        # read from Tiramisu
TIRAMISU_PRIVATE_KEY=0x... node scripts/publish.mjs demo-newsroom 1 "We have received no secret orders." 7
TIRAMISU_PRIVATE_KEY=0x... node scripts/publish.mjs demo-newsroom 2 "Canary withdrawn." 7 --withdraw
```
Viewer: open `index.html` (or the GitHub Pages link). No build step.

## Deployment / wallets
| Item | Value |
|---|---|
| Entity creator wallet (Tiramisu) | `0x27440d0125f0F49FFfe3aF16d2FcB566aDEf841A` |
| Demo entities / tx | 4 live entities, see [`DEPLOYMENTS.md`](DEPLOYMENTS.md) |

## Demo script (≤3 min)
See `DEMO.md`.

All code was written Oct 14–18, 2026, with AI-assisted development. No pre-existing work. Synthetic data only. MIT.
