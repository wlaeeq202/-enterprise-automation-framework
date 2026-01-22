// ------------------------------------------------------------
// PURPOSE:
// Validate that Snowflake-style aggregated data (fact table)
// correctly matches aggregation derived from raw source data.
// ------------------------------------------------------------

// Node.js core modules for file handling
const fs = require('fs');
const path = require('path');

// Resolve file paths for input JSON files
// raw_costs.json        -> source-level transactional data
// snowflake_fact_costs.json -> transformed / aggregated data
const rawPath = path.join(__dirname, 'raw_costs.json');
const factPath = path.join(__dirname, 'snowflake_fact_costs.json');

// Read and parse JSON files into JavaScript objects
const raw = JSON.parse(fs.readFileSync(rawPath, 'utf8'));
const facts = JSON.parse(fs.readFileSync(factPath, 'utf8'));

/**
 * Aggregates raw cost data by department.
 *
 * WHY:
 * Snowflake fact tables typically store pre-aggregated values.
 * We recreate that aggregation here from raw data to validate
 * the ETL / transformation logic.
 *
 * HOW:
 * - Iterate through each raw row
 * - Sum amounts per department using a Map
 * - Convert Map into a comparable array format
 */
function aggregateRawByDepartment(rawRows) {
  const map = new Map(); // department -> totalAmount

  for (const row of rawRows) {
    // Get existing total for department (or default to 0)
    const current = map.get(row.department) || 0;

    // Add current row's amount to department total
    map.set(row.department, current + row.amount);
  }

  // Convert Map to array of objects for easier comparison
  return Array.from(map.entries()).map(
    ([department, totalAmount]) => ({
      department,
      totalAmount
    })
  );
}

// Build expected results by aggregating raw source data
const expected = aggregateRawByDepartment(raw);

// Sorting function to ensure deterministic comparison
// (order matters when comparing arrays)
const sortFn = (a, b) => a.department.localeCompare(b.department);

// Sort both expected data and Snowflake fact data
expected.sort(sortFn);
facts.sort(sortFn);

/**
 * Validate equality between:
 * - Expected aggregation (from raw data)
 * - Actual Snowflake fact table output
 *
 * CONDITIONS:
 * 1. Same number of departments
 * 2. Same department names (same order)
 * 3. Same total amount per department
 */
const isEqual =
  expected.length === facts.length &&
  expected.every((exp, idx) =>
    exp.department === facts[idx].department &&
    exp.totalAmount === facts[idx].totalAmount
  );

// Final validation result
if (isEqual) {
  // Success case: transformation logic is correct
  console.log('✅ Snowflake transformed data matches raw source data.');
  process.exit(0); // exit cleanly for CI/CD pipelines
} else {
  // Failure case: data mismatch detected
  console.error('❌ Mismatch between raw data aggregation and Snowflake facts.');
  console.error('Expected:', expected);
  console.error('Found:   ', facts);
  process.exit(1); // fail build / pipeline
}
