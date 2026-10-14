# Tiramisu deployments (chain 7738577)

Creator wallet: `0x27440d0125f0F49FFfe3aF16d2FcB566aDEf841A` (testnet-only burner, the single publisher of all demo canaries).
Funded via the Hub faucet in tx `0x8f2810445f46f71ea1d26f0f469387c78fcbf87e3d75c7301259f6e073e4615a`.

All entities were published 2026-10-14 with `validDays = 30` and Entity Expiration at block ~1,864,2xx (≈ 13 Nov 2026 at ~2 s blocks),
so they all stay live through judging and winners day (23 Oct).

| Org | Seq | State | Entity key | Tx |
|---|---|---|---|---|
| demo-newsroom | 1 | alive | `0x8be8101b3641135e3e20a25ea9146fb53e65b8a4f991af8a78de4823c5dbc355` | [0xa5a589db…60ee](https://tiramisu.explorer.arkiv.network/tx/0xa5a589dbebae7898333801029531c263cc9b7d600f56cda0c23c8ba7b86060ee) |
| demo-newsroom | 2 | alive (renewal, latest) | `0x95d860be139c73837d8c422718860988b9a06fa218f7b49f0ff855148ec83724` | [0x41ce6bbf…9abd](https://tiramisu.explorer.arkiv.network/tx/0x41ce6bbfd1b8ca7075da3dc5d0acbbcc722e959cd2fda964dd036ae80d2b9abd) |
| demo-vpn | 1 | alive | `0x6ed00ad36ce84234616874a60e0dc79ad4978bf1d97db82c05a8e9de9db78b1a` | [0x63af3a97…891a](https://tiramisu.explorer.arkiv.network/tx/0x63af3a97ee2fea1388af42b8a083def4ed487f3c11dc2a0bd4a53d06ed6e891a) |
| demo-vpn | 2 | **withdrawn** (latest) | `0x24bd72afa727b78518952ae85a882805298a0b6a37b9adeca4d6afb8b26f091a` | [0xa3dc5946…9dec](https://tiramisu.explorer.arkiv.network/tx/0xa3dc594686b57f33f19f0cc1d05f9baa01b90cf922bd0b0db9d23fae5c469dec) |

Expected viewer output (https://ifeohsun.github.io/arkiv-canary/): `demo-newsroom ALIVE`, `demo-vpn WITHDRAWN`, 4 entities, all signatures ✅.
Querying an org that never published (e.g. `demo-gone`) shows DEAD, which is the same state a canary reaches once its entity expires.
