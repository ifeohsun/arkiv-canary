// Usage: TIRAMISU_PRIVATE_KEY=0x.. node scripts/publish.mjs <org> <seq> "<statement>" [validDays] [--withdraw]
import { privateKeyToAccount } from "viem/accounts";
import { buildStatement, sign } from "../src/canary.mjs";
import { walletClient, publish } from "../src/arkiv.mjs";

const [org, seq, statement, validDays = "7"] = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const withdraw = process.argv.includes("--withdraw");
const pk = process.env.TIRAMISU_PRIVATE_KEY;
if (!pk || !org) { console.error("see usage in file header"); process.exit(1); }
const account = privateKeyToAccount(pk);
const s = buildStatement({ org, seq: Number(seq), statement, validDays: Number(validDays),
  headline: withdraw ? "CANARY WITHDRAWN" : "All clear" });
const signed = { ...(await sign(account, s)), withdrawn: withdraw };
const { entityKey, txHash } = await publish(walletClient(account), signed);
console.log(JSON.stringify({ creator: account.address, entityKey, txHash,
  explorer: `https://tiramisu.explorer.arkiv.network/tx/${txHash}` }, null, 2));
