// Usage: node scripts/list.mjs [org]
import { publicClient, listCanaries } from "../src/arkiv.mjs";
import { orgStatus } from "../src/canary.mjs";
const org = process.argv[2];
const items = await listCanaries(publicClient(), org);
const byOrg = {};
for (const c of items.filter((c) => c.verified)) (byOrg[c.org] ??= []).push(c);
for (const [o, cs] of Object.entries(byOrg)) console.log(o.padEnd(24), orgStatus(cs).padEnd(10), "latest seq", Math.max(...cs.map((c) => c.seq)));
if (org && !byOrg[org]) console.log(org.padEnd(24), "dead       (no live canary on Arkiv)");
console.log(`\n${items.length} entities, ${items.filter((c) => !c.verified).length} failed verification`);
