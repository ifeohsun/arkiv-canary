import test from "node:test";
import assert from "node:assert";
import { privateKeyToAccount, generatePrivateKey } from "viem/accounts";
import { buildStatement, sign, verify, orgStatus } from "../src/canary.mjs";

const acct = privateKeyToAccount(generatePrivateKey());
const s = buildStatement({ org: "demo-newsroom", seq: 1, statement: "We have received no secret orders." });

test("sign/verify roundtrip", async () => {
  const signed = await sign(acct, s);
  assert.equal((await verify(signed, acct.address)).ok, true);
});
test("tampered statement fails", async () => {
  const signed = await sign(acct, s);
  assert.equal((await verify({ ...signed, statement: "edited" })).ok, false);
});
test("signer must match creator", async () => {
  const signed = await sign(acct, s);
  const other = privateKeyToAccount(generatePrivateKey()).address;
  assert.equal((await verify(signed, other)).reason, "signer is not the entity creator");
});
test("status: empty=dead, newest wins", () => {
  assert.equal(orgStatus([]), "dead");
  assert.equal(orgStatus([{ seq: 1 }, { seq: 2, withdrawn: true }]), "withdrawn");
  assert.equal(orgStatus([{ seq: 3 }, { seq: 2, withdrawn: true }]), "alive");
});
test("input validation", () => {
  assert.throws(() => buildStatement({ org: "Bad Org", seq: 1, statement: "x" }));
});
