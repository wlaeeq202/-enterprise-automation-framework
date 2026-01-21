# Snowflake Transformation Rules (Simulated)

Source: SQL `Costs` table (or API data exposed from it).

Target: Snowflake fact table with aggregated costs per department.

Rules:
- Group by `department`
- Sum `Amount` as `totalAmount`
- One row per department
- IT = 5000 + 1500 = 6500
- HR = 800
