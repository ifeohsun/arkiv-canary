import { createPublicClient, createWalletClient } from "@arkiv-network/sdk";
import { tiramisu } from "@arkiv-network/sdk/chains";
import { eq } from "@arkiv-network/sdk/query";
import { i32 } from "@arkiv-network/sdk/attr";
import { ExpirationTime, jsonToPayload } from "@arkiv-network/sdk/utils";
import { http } from "viem";
import { APP, verify } from "./canary.mjs";

export const publicClient = () => createPublicClient({ chain: tiramisu, transport: http() });
export const walletClient = (account) => createWalletClient({ chain: tiramisu, transport: http(), account });

export async function publish(client, signed) {
  return client.createEntity({
    payload: jsonToPayload(signed),
    contentType: "application/json",
    attributes: { app: APP, org: signed.org, seq: i32(signed.seq), withdrawn: signed.withdrawn ? "yes" : "no" },
    expires: ExpirationTime.fromDays(signed.validDays),   // canary dies automatically if not renewed
  });
}

/** Fetch live canaries (optionally for one org) and verify each signature against its creator. */
export async function listCanaries(pc, org) {
  let qb = pc.select({ key: true, owner: true, creator: true, payload: true, expiresAt: true }).where(
    org ? [eq("app", APP), eq("org", org)] : eq("app", APP));
  const out = [];
  for await (const e of qb) {
    let body;
    try { body = e.toJson(); } catch { continue; }
    const v = await verify(body, e.creator ?? e.owner);
    out.push({ key: e.key, creator: e.creator ?? e.owner, expiresAt: e.expiresAt, ...body, verified: v.ok, reason: v.reason });
  }
  return out;
}
