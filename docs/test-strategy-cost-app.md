# Test Strategy – COST Application (Angular • C# • SQL • Snowflake)

This document describes how I would approach testing an enterprise **COST** application built with:

- **Frontend:** Angular
- **Backend:** C# (REST APIs / services)
- **Data:** SQL + Snowflake (reporting / analytics)

---

## 1. Testing Goals

- Ensure core COST workflows (create/update/read costs) are **functionally correct**.
- Validate **data integrity** between UI, C# APIs, SQL DB, and Snowflake.
- Catch regressions early via **automation** in CI.
- Provide clear, traceable evidence for releases.

---

## 2. Scope & Layers

### 2.1 UI (Angular)

Focus areas:

- Routing & navigation
- Forms & validation (required fields, formats, numeric ranges)
- Filters, sorting, pagination
- Role-based access control (what different users can/cannot see)
- Error states (offline, 500s, validation errors)

Approach:

- Use **Playwright + POM** (as in this repo):
  - Separate page objects for each major Angular route/page.
  - Component-level testing for shared UI components (tables, filters, modals).
  - Visual or layout sanity checks for critical pages.

---

### 2.2 API (C# services)

Focus areas:

- REST endpoints: create/update/delete/read COST entities.
- Validation of status codes (2xx / 4xx / 5xx).
- Request/response schema and mandatory fields.
- Business rules (e.g., cost cannot be negative, required relationships).
- Auth, tokens, and permissions per role.

Approach:

- Use **Playwright `request` fixture** (as in `src/api/tests/user.api.spec.js`).
- Tests organized by endpoint and business scenario.
- Contract-style assertions: field presence, types, ranges, enums.
- Negative tests: invalid payloads, unauthorized users, invalid IDs.

---

### 2.3 Database (SQL)

Focus areas:

- Data correctness: records created/updated as expected by APIs.
- Referential integrity, primary/foreign keys.
- Idempotency: repeated calls don’t corrupt data.
- Soft deletes vs hard deletes.

Approach:

- For real project: use a DB access layer in tests (e.g., Node, C#, or Python client).
- Assert:
  - API response → row exists in SQL DB with correct values.
  - Updates made via UI/API reflect in DB immediately or as per design.
- Use **test data management strategy**:
  - Test schemas, test tenants, or synthetic data.
  - Cleanup via SQL scripts or teardown hooks.

---

### 2.4 Snowflake (Analytics / Reporting)

Focus areas:

- ETL or data pipeline correctness (SQL DB → Snowflake).
- Metrics computed correctly (aggregations, rollups, dashboards).
- Data freshness (SLA on latency).

Approach:

- For automated checks:
  - Query Snowflake views/tables (using its SDK) to validate key metrics.
  - Compare a sample of COST records between source DB and Snowflake.
- For manual/exploratory:
  - Validate dashboards vs raw query results.
  - Time-travel or historical data checks if available.

---

## 3. Automation Approach

### 3.1 UI Automation (Angular)

- Use **Playwright + POM**, structured like:

  - `pages/CostListPage`
  - `pages/CostDetailPage`
  - `pages/LoginPage`, `Header`, `SideNav` as shared components.

- Scenarios:
  - Create/edit/delete a cost item.
  - Filter and sort by date, team, category.
  - Permissions: different roles see different data.

This repo demonstrates this approach with **Login + Inventory** for SauceDemo using POM.

---

### 3.2 API Automation (C#)

- Create test suites similar to `src/api/tests/user.api.spec.js`, but for COST endpoints:
  - `GET /costs`
  - `POST /costs`
  - `PATCH /costs/{id}`
  - `DELETE /costs/{id}`

- Use:
  - Positive tests (valid data).
  - Negative tests (invalid payloads, unauthorized).
  - Boundary tests (max lengths, limits).

---

### 3.3 Integration in CI

- Use **GitHub Actions** or Azure DevOps:
  - On each push/PR:
    - Spin up test environment or point to test endpoints.
    - Run API + UI tests in headless mode.
    - Publish HTML report and logs.
  - Add gates (e.g., no merge if critical tests fail).

This repository already has:

- GitHub Actions workflow (`.github/workflows/ci.yml`)
- Playwright HTML reports as artifacts.

---

## 4. Non-Functional Testing Considerations

- **Performance:** targeted load tests on key endpoints, plus simple response time assertions in functional tests.
- **Security:** basic checks like auth required for modifying COST data, no sensitive data leakage.
- **Usability:** tab order, form errors, keyboard accessibility where required.

---

## 5. How This Repo Supports the Strategy

This repo provides:

- A **Playwright UI framework with POM** (similar to what would be used for Angular).
- **API test patterns** using Playwright’s `request` fixture.
- **CI integration** example with GitHub Actions.
- A structured, extensible layout ready to be adapted to a real COST application.

In an actual project, I would reuse these patterns and swap the endpoints, page objects, and DB/Snowflake integrations to match the real application.
