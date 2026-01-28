/**
 * generate_costs.js
 * ------------------------------------------------------------
 * PURPOSE:
 * Simulate a large Excel upload by generating deterministic raw
 * transactional cost records (e.g., 5,000 rows).
 *
 * WHY (HealthMonix-style):
 * - Real world: Excel arrives with millions of rows
 * - We want CI to stay FAST, but still catch ETL regressions
 * - So we generate a representative dataset (5k rows) on every PR
 *
 * OUTPUT:
 * - Writes to: enterprise-data-simulation/snowflake/data/raw_costs.json
 *
 * HOW:
 * - Uses a seeded random generator so output is repeatable in CI
 * - Stable data = stable tests (no flaky CI)
 * ------------------------------------------------------------
 */

const fs = require("fs");
const path = require("path");

// Where the generated "Excel upload" file will be written
const outputPath = path.join(__dirname, "..", "data", "raw_costs.json");

// Default row count for CI; you can override locally:
// ROWS=20000 node generate_costs.js
const ROWS = Number(process.env.ROWS || 5000);

// Keep a small set of depts so aggregation is meaningful
const DEPARTMENTS = ["IT", "HR", "Finance", "Operations", "Sales"];

/**
 * Deterministic pseudo-random generator (LCG).
 * Makes the dataset repeatable across machines and CI runs.
 */
function createSeededRng(seed = 12345) {
  let state = seed;
  return function next() {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296; // returns 0..1
  };
}

function generateRawCosts(rows) {
  const rand = createSeededRng(42);
  const data = [];

  for (let i = 1; i <= rows; i++) {
    const department = DEPARTMENTS[Math.floor(rand() * DEPARTMENTS.length)];

    // Amount range: $10..$5000 (integer)
    const amount = Math.floor(10 + rand() * 4990);

    data.push({
      id: i,
      department,
      amount
    });
  }

  return data;
}

// Ensure data folder exists (important for clean CI runs)
fs.mkdirSync(path.dirname(outputPath), { recursive: true });

// Generate and write file
const raw = generateRawCosts(ROWS);
fs.writeFileSync(outputPath, JSON.stringify(raw, null, 2), "utf8");

console.log(`✅ Generated ${ROWS} rows -> ${outputPath}`);
