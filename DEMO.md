# Demo video script (≤ 3 min)
1. (0:00) Problem: canaries on websites can be edited, taken down, or forced to stay up. Show the README "Why".
2. (0:25) Open https://ifeohsun.github.io/arkiv-canary/ and search `demo-newsroom`. It shows ALIVE, with the signer and the entity key.
3. (0:50) Terminal: `node scripts/publish.mjs demo-newsroom 2 "..." 7` prints the tx hash. Open it in the Tiramisu explorer.
4. (1:20) Refresh the viewer. Seq #2 is now the latest, and the signature check shows ✅.
5. (1:40) Publish `--withdraw` and the viewer shows WITHDRAWN. Explain that if nothing is published, the entity
   expires after `validDays` and the viewer shows DEAD with no action by anyone.
6. (2:20) Show `arkiv/schema.md` (what's on and off Arkiv) and `arkiv/friction.md`. Close with the Censorship Resistance pitch.
