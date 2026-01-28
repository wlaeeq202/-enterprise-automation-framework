/**
 * transform_costs.js
 * ------------------------------------------------------------
 * PURPOSE:
 * Simulate the Snowflake ETL transformation:
 * - GROUP BY department
 * - SUM amount => totalAmount
 *
 * INPUT:
 *  enterprise-data-simulation/snowflake/data/raw_costs.json
 *
 * OUTPUT:
 *  enterprise-data-simulation/snowflake/data/snowflake_fact_costs.json
 *
 * WHY:
 * In enterprise data systems, we often store pre-aggregated "fact"
 * tables in Snowflake for fast analytics/reporting.
 * ------------------------------------------------------------
 */

const fs = require("fs");
const path = require("path");

// Input file: simulated "Excel upload"
const rawPath = path.join(__dirname, "..", "data", "raw_costs.json");

// Output file: simulated Snowflake "fact" table
const outPath = path.join(__dirname, "..", "data", "snowflake_fact_costs.json");

/**
 * Transform raw transactional rows into a Snowflake-style fact table.
 *
 * HOW:
 * - Use a Map to accumulate totals per department
 * - Convert the Map to an array of objects: { department, totalAmount }
 */
function transformToFactTable(rawRows) {
  const totals = new Map(); // department -> totalAmount

  for (const row of rawRows) {
    const current = totals.get(row.department) || 0;
    totals.set(row.department, current + row.amount);
  }

  return Array.from(totals.entries()).map(([department, totalAmount]) => ({
    department,
    totalAmount
  }));
}

// Guardrail: make sure raw input exists
if (!fs.existsSync(rawPath)) {
  console.error(`❌ Missing input file: ${rawPath}`);
  console.error("Run generate_costs.js first.");
  process.exit(1);
}

// Read raw data
const raw = JSON.parse(fs.readFileSync(rawPath, "utf8"));

// Transform
const facts = transformToFactTable(raw);

// Ensure output directory exists
fs.mkdirSync(path.dirname(outPath), { recursive: true });

// Write output
fs.writeFileSync(outPath, JSON.stringify(facts, null, 2), "utf8");

console.log(`✅ Transformed raw -> fact output: ${outPath}`);
console.log(`ℹ️ Departments aggregated: ${facts.length}`);
