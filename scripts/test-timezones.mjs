/**
 * Runs the whole test suite as if the device were in several different time zones.
 *   npm run test:tz
 * Each run must report the zone it was asked for (see src/timezone.test.ts), so this cannot pass by accident.
 */
import { spawnSync } from "node:child_process";

const zones = process.argv.slice(2);
const ZONES = zones.length ? zones : ["Asia/Kolkata", "UTC", "America/Los_Angeles", "Pacific/Kiritimati", "Pacific/Pago_Pago", "Australia/Sydney"];

let failed = 0;
for (const tz of ZONES) {
  const r = spawnSync("npx", ["vitest", "run"], { env: { ...process.env, TEST_TZ: tz }, encoding: "utf8", shell: true });
  const out = (r.stdout ?? "") + (r.stderr ?? "");
  const tests = /Tests\s+(.*)/.exec(out)?.[1]?.trim() ?? "no result";
  const bad = r.status !== 0;
  if (bad) failed++;
  console.log(`${bad ? "FAIL" : "ok  "}  ${tz.padEnd(22)} ${tests}`);
  if (bad) {
    for (const l of out.split("\n").filter((l) => /FAIL|AssertionError|Error:/.test(l)).slice(0, 8)) console.log("        " + l.trim());
  }
}
process.exit(failed ? 1 : 0);
