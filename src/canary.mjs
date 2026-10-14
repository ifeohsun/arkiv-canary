// Pure helpers: build, sign and verify canary statements. No network.
import { verifyMessage } from "viem";

export const APP = "crops-canary";
export const SCHEMA_VERSION = 1;

/** Canonical text that the publisher signs. Order of fields is fixed. */
export function canonical(s) {
  return [
    `crops-canary v${SCHEMA_VERSION}`,
    `org: ${s.org}`,
    `seq: ${s.seq}`,
    `issued: ${s.issued}`,
    `valid_days: ${s.validDays}`,
    `statement: ${s.statement}`,
    `headline: ${s.headline}`,
  ].join("\n");
}

export function buildStatement({ org, seq, statement, headline = "", validDays = 7, issued = new Date().toISOString() }) {
  if (!/^[a-z0-9-]{2,40}$/.test(org)) throw new Error("org must be a lowercase slug");
  if (!Number.isInteger(seq) || seq < 1) throw new Error("seq must be a positive integer");
  if (!statement || statement.length > 2000) throw new Error("statement required (<=2000 chars)");
  return { org, seq, statement, headline, validDays, issued };
}

export async function sign(account, s) {
  return { ...s, signature: await account.signMessage({ message: canonical(s) }), signer: account.address };
}

/** Verify signature and (optionally) that the signer matches the Arkiv entity owner/creator. */
export async function verify(signed, expectedAddress) {
  const ok = await verifyMessage({ address: signed.signer, message: canonical(signed), signature: signed.signature });
  if (!ok) return { ok: false, reason: "bad signature" };
  if (expectedAddress && expectedAddress.toLowerCase() !== signed.signer.toLowerCase())
    return { ok: false, reason: "signer is not the entity creator" };
  return { ok: true };
}

/** Status of an org given its verified canaries (newest seq wins). Expired entities simply vanish. */
export function orgStatus(canaries) {
  if (!canaries.length) return "dead";              // nothing alive on Arkiv => canary died
  const latest = canaries.reduce((a, b) => (b.seq > a.seq ? b : a));
  return latest.withdrawn ? "withdrawn" : "alive";
}
