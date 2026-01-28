/**
 * validate_transformation.js
 * ------------------------------------------------------------
 * PURPOSE:
 * Validate that the Snowflake-style fact output (aggregated data)
 * exactly matches what we independently compute from raw data.
 *
 * WHY:
 * - Prevent silent ETL regressions when code changes
 * - Keep CI fast by validating on representative data (5k rows)
 * - Fail the pipeline if totals are wrong (data correctness gate)
 * - Emit runtime metrics (ms + seconds) for CI visibility
 *
 * INPUT:
 *  enterprise-data-simulation/snowflake/data/raw_costs.json
 *  enterprise-data-simulation/snowflake/data/snowflake_fact_costs.json
 *
 * OUTPUT:
 *  Console pass/fail + exit code:
 *   - exit 0 => success (safe)
 *   - exit 1 => failure (block PR/deploy)
 * ------------------------------------------------------------
 */

const fs = require("fs");
const path = require("path");

// Input paths
const rawPath = path.join(__dirname, "..", "data", "raw_costs.json");
const factPath = path.join(__dirname, "..", "data", "snowflake_fact_costs.json");

/**
 * Independently aggregate raw rows by department.
 * This is our "expected" result, computed separately from transform script.
 */
function aggregateRawByDepartment(rawRows) {
  const map = new Map(); // department -> totalAmount

  for (const row of rawRows) {
    const current = map.get(row.department) || 0;
    map.set(row.department, current + row.amount);
  }

  return Array.from(map.entries()).map(([department, totalAmount]) => ({
    department,
    totalAmount
  }));
}

// Sorting makes comparisons deterministic (order-independent)
function sortFn(a, b) {
  return a.department.localeCompare(b.department);
}

/**
 * Compare expected vs actual fact output.
 * Returns a detailed result object for easy debugging.
 */
function validate(expected, actual) {
  expected.sort(sortFn);
  actual.sort(sortFn);

  if (expected.length !== actual.length) {
    return {
      ok: false,
      reason: "Different number of departments",
      expected,
      actual
    };
  }

  for (let i = 0; i < expected.length; i++) {
    const e = expected[i];
    const a = actual[i];

    // Strict equality check: same department + exact total
    // If you ever switch to decimal amounts, consider epsilon comparison.
    if (e.department !== a.department || e.totalAmount !== a.totalAmount) {
      return {
        ok: false,
        reason: `Mismatch for department "${e.department}"`,
        expected,
        actual
      };
    }
  }

  return { ok: true };
}

/**
 * Read JSON from a file with helpful errors.
 */
function readJsonOrExit(filePath, friendlyName) {
  try {
    const text = fs.readFileSync(filePath, "utf8");
    return JSON.parse(text);
  } catch (err) {
    console.error(`❌ Failed to read/parse ${friendlyName}: ${filePath}`);
    console.error(err?.message || err);
    process.exit(1);
  }
}

// Guardrails: ensure input files exist
if (!fs.existsSync(rawPath)) {
  console.error(`❌ Missing raw file: ${rawPath}`);
  console.error("Run generate_costs.js first (npm run etl:generate).");
  process.exit(1);
}

if (!fs.existsSync(factPath)) {
  console.error(`❌ Missing fact file: ${factPath}`);
  console.error("Run transform_costs.js first (npm run etl:transform).");
  process.exit(1);
}

// ---- TIMING START (high precision) ----
const start = process.hrtime.bigint();

// Read data
const raw = readJsonOrExit(rawPath, "raw costs");
const facts = readJsonOrExit(factPath, "fact costs");

// Build expected independently
const expected = aggregateRawByDepartment(raw);

// Validate
const result = validate(expected, facts);

// ---- TIMING END ----
const end = process.hrtime.bigint();
const elapsedMs = Number(end - start) / 1_000_000;
const elapsedSec = elapsedMs / 1000;

// Emit runtime for CI visibility (0s issue solved)
console.log(`⏱️ ETL validation runtime: ${elapsedMs.toFixed(2)} ms (${elapsedSec.toFixed(3)} s)`);

if (result.ok) {
  console.log("✅ Validation PASSED: fact output matches raw aggregation.");
  process.exit(0);
} else {
  console.error(`❌ Validation FAILED: ${result.reason}`);

  // Print smaller, more readable diff hints first
  const expectedKeys = expected.map((x) => x.department);
  const actualKeys = facts.map((x) => x.department);

  console.error("Expected departments:", expectedKeys);
  console.error("Actual departments:  ", actualKeys);

  // Full outputs for deep debugging (kept last)
  console.error("Expected (full):", expected);
  console.error("Actual (full):  ", facts);

  process.exit(1);
}
