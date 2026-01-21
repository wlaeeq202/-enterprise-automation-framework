// Validate that our Snowflake-like aggregated data matches the raw source data.

const fs = require('fs');
const path = require('path');

const rawPath = path.join(__dirname, 'raw_costs.json');
const factPath = path.join(__dirname, 'snowflake_fact_costs.json');

const raw = JSON.parse(fs.readFileSync(rawPath, 'utf8'));
const facts = JSON.parse(fs.readFileSync(factPath, 'utf8'));

function aggregateRawByDepartment(rawRows) {
  const map = new Map();
  for (const row of rawRows) {
    const current = map.get(row.department) || 0;
    map.set(row.department, current + row.amount);
  }
  return Array.from(map.entries()).map(([department, totalAmount]) => ({
    department,
    totalAmount
  }));
}

const expected = aggregateRawByDepartment(raw);

const sortFn = (a, b) => a.department.localeCompare(b.department);

expected.sort(sortFn);
facts.sort(sortFn);

const isEqual =
  expected.length === facts.length &&
  expected.every((exp, idx) =>
    exp.department === facts[idx].department &&
    exp.totalAmount === facts[idx].totalAmount
  );

if (isEqual) {
  console.log('✅ Snowflake transformed data matches raw source data.');
  process.exit(0);
} else {
  console.error('❌ Mismatch between raw data aggregation and Snowflake facts.');
  console.error('Expected:', expected);
  console.error('Found:   ', facts);
  process.exit(1);
}
