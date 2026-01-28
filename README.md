# Enterprise Automation Framework

> Enterprise-grade **UI + API + Data Validation** automation framework using  
> **Playwright**, **Selenium**, **Node.js**, and **GitHub Actions CI**.  
>  
> Designed to demonstrate how modern SDETs validate **end-to-end systems**:  
> **UI → API → Database (Snowflake-style ETL)** — safely and efficiently.

![CI Status](https://github.com/wlaeeq202/-enterprise-automation-framework/actions/workflows/ci.yml/badge.svg)

---

## ⭐ Overview

This repository showcases a **real-world enterprise automation architecture** used in data-driven platforms.

It demonstrates how an automation engineer:
- Validates **UI, API, and backend data consistency**
- Protects **data pipelines** from regressions
- Keeps **CI pipelines fast** while ensuring correctness
- Scales validation logic to large datasets (Snowflake-style ETL)

The framework is intentionally modular and mirrors how automation is structured in large engineering organizations.

---

## 🧰 Tech Stack

- **Language:** JavaScript (Node.js)
- **UI Automation (Modern):** Playwright (Page Object Model)
- **UI Automation (Legacy):** Selenium WebDriver
- **API Testing:** Playwright `request` fixture
- **Backend Simulation:** C# (.NET 8 Minimal API)
- **Data Validation:** Snowflake-style ETL aggregation checks
- **CI/CD:** GitHub Actions
- **Reporting:** Playwright HTML Report + CI artifacts

---

## 🎯 Enterprise Alignment (Angular • C# • SQL • Snowflake)

This framework is backend-agnostic but maps directly to common enterprise stacks.

### Angular Frontend
- Page Object Model mirrors Angular components
- UI tests validate API-driven UI data
- Ready for routing, guards, and form validation

### C# Backend
- Minimal API simulates a COST microservice
- REST contract, payload, and integration testing
- Mirrors real .NET service patterns

### SQL / Snowflake
- Raw transactional data vs aggregated fact tables
- Deterministic ETL validation logic
- CI-based regression protection for data pipelines

---

## 🧩 Enterprise Data Simulation (Snowflake-Style ETL)

All data-processing logic lives under:

### Folder Structure
```text
snowflake/
├─ data/
│  ├─ raw_costs.json              # Simulated Excel upload (generated in CI)
│  └─ snowflake_fact_costs.json   # Aggregated fact-table output
├─ scripts/
│  ├─ generate_costs.js           # Generates deterministic raw data (5,000 rows)
│  ├─ transform_costs.js          # GROUP BY + SUM (fact-table simulation)
│  └─ validate_transformation.js  # Validates raw vs fact data correctness
├─ transformationrules.md         # Business transformation rules
└─ README.md
```

```text
┌──────────────────────────────────────────────┐
│  Raw Data Ingestion                          │
│  • Simulates Excel file with 5,000 rows      │
│  • Deterministic (seeded) data               │
└──────────────────────────────────────────────┘
                │
                ▼
┌──────────────────────────────────────────────┐
│  Transformation Layer                        │
│  • GROUP BY department                       │
│  • SUM amount → totalAmount                  │
│  • Mirrors Snowflake fact-table logic        │
└──────────────────────────────────────────────┘
                │
                ▼
┌──────────────────────────────────────────────┐
│  Validation Layer                            │
│  • Re-aggregate raw data independently       │
│  • Compare expected vs transformed output    │
│  • Fail CI on mismatch                       │
└──────────────────────────────────────────────┘

```
## 🤖 GitHub Actions CI

ETL validation runs automatically on every pull request and push to ensure
data correctness without slowing down the pipeline.

```text
.github/workflows/etl-validate.yml
```

## 🖥 UI Automation (Playwright)

```text
src/ui/playwright/
├─ pages/        # Page Object Model
└─ tests/        # UI tests
```

## 🌐 API Automation

```text
src/api/tests/

```

## 🔁 Local Execution

### Install Dependencies
```bash
npm ci
npx playwright install
```
### Run All Tests
```bash
npm test
```
### Run UI Tests (Debug / Headed)
```bash
npx playwright test src/ui --headed
```
### Run API Tests Only
```bash
npx playwright test src/api
```
### Run Snowflake-Style ETL Validation
```bash
node enterprise-data-simulation/snowflake/scripts/generate_costs.js
node enterprise-data-simulation/snowflake/scripts/transform_costs.js
node enterprise-data-simulation/snowflake/scripts/validate_transformation.js

```