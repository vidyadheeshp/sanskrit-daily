/**
 * Lets a test run pretend the device is in another time zone:  TEST_TZ=America/Los_Angeles npm test
 * (or `npm run test:tz` for a set of zones).
 *
 * Why this exists: on Windows, writing TZ=America/Los_Angeles before a command is silently IGNORED for IANA names, so a
 * "time-zone matrix" can pass without ever changing the zone. Assigning process.env.TZ inside Node does work, and
 * src/timezone.test.ts checks that it took effect.
 */
if (process.env.TEST_TZ) process.env.TZ = process.env.TEST_TZ;
