# Enterprise Automation Framework

> Hybrid **UI + API** automation framework using **Playwright**, **Selenium WebDriver**, and **GitHub Actions CI**.  
> Built to showcase modern SDET skills for enterprise-grade testing.

![CI Status](https://github.com/wlaeeq202/-enterprise-automation-framework/actions/workflows/ci.yml/badge.svg)

---

## ⭐ Overview

This repository contains a **full-stack automation framework** designed to demonstrate real-world enterprise testing practices:

- Modern **UI automation** using **Playwright + Page Object Model (POM)**
- **API automation** (GET / POST / PATCH / DELETE)
- **Selenium WebDriver** example for legacy UI automation
- **Node.js + npm** project structure
- **CI/CD automation** using **GitHub Actions**
- **C# backend simulation** with **Snowflake-style data validation**

The framework mirrors how automation is built, documented, and executed in large enterprise environments.

---

## 🧰 Tech Stack

- **Language:** JavaScript (Node.js)
- **UI Automation (Modern):** Playwright Test
- **UI Automation (Legacy):** Selenium WebDriver
- **API Testing:** Playwright `request` fixture
- **Backend Simulation:** C# (.NET 8 Minimal API)
- **Data Validation:** Snowflake-style aggregation checks (JSON-based)
- **CI/CD:** GitHub Actions
- **Reporting:** Playwright HTML Report

---

## 🎯 Alignment with Angular • C# • SQL • Snowflake Roles

This framework is backend-agnostic but maps directly to an enterprise stack:

- **Angular Frontend**
  - UI tests follow **Page Object Model**
  - Same patterns apply to Angular components, routing, guards, forms, and API-driven UI

- **C# Backend**
  - REST API validation (contracts, status codes, payloads)
  - Local **C# Minimal API** simulates a real backend service

- **SQL / Snowflake**
  - Data validation simulates Snowflake fact-table verification
  - Raw data vs aggregated data consistency checks

---

## 🧩 Enterprise Data Simulation (C# • SQL • Snowflake-style)

```text
enterprise-data-simulation/
 ├─ csharp-api/      # C# Minimal API simulating a COST microservice
 ├─ database/        # SQL schema + seed data
 └─ snowflake/       # Aggregation + validation logic
┌──────────────────────────────────────────────────────────┐
│                     GitHub Actions CI                     │
│                    ubuntu-latest VM                       │
└──────────────────────────────────────────────────────────┘
            │
            ▼
┌──────────────────────────────────────────────────────────┐
│  Environment Setup                                        │
│  • Checkout repository                                   │
│  • Install Node.js                                       │
│  • Install Playwright browsers (headless)                 │
│  • Install .NET 8 SDK                                     │
└──────────────────────────────────────────────────────────┘
            │
            ▼
┌──────────────────────────────────────────────────────────┐
│  Backend Layer                                            │
│  • dotnet restore & build                                 │
│  • InMemoryCostRepository                                 │
│  • API: http://localhost:5050/api/costs                   │
└──────────────────────────────────────────────────────────┘
            │
            ▼
┌──────────────────────────────────────────────────────────┐
│  Playwright Test Runner                                   │
│                                                          │
│  UI Automation (POM)                                      │
│  • LoginPage                                             │
│  • InventoryPage                                        │
│                                                          │
│  API Automation                                           │
│  • ReqRes Public API                                     │
│  • Local C# COST API                                     │
└──────────────────────────────────────────────────────────┘
            │
            ▼
┌──────────────────────────────────────────────────────────┐
│  Data Validation Layer                                    │
│  • raw_costs.json                                        │
│  • snowflake_fact_costs.json                              │
│  • Aggregation comparison                                 │
└──────────────────────────────────────────────────────────┘
            │
            ▼
┌──────────────────────────────────────────────────────────┐
│  CI Artifacts                                             │
│  • Playwright HTML report                                 │
│  • Screenshots / Videos / Traces                          │
│  • Build logs                                             │
└──────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────┐
│                  LOCAL EXECUTION FLOW                    │
│              Developer Machine (Local)                   │
└──────────────────────────────────────────────────────────┘
            │
            ▼
┌──────────────────────────────────────────────────────────┐
│  Prerequisites                                           │
│  • Node.js 18+ (Node 20 recommended)                      │
│  • npm                                                   │
│  • (Optional) .NET 8 SDK                                 │
└──────────────────────────────────────────────────────────┘
            │
            ▼
┌──────────────────────────────────────────────────────────┐
│  Install Dependencies                                    │
│  • npm ci                                                │
│  • npx playwright install                                │
└──────────────────────────────────────────────────────────┘
            │
            ▼
┌──────────────────────────────────────────────────────────┐
│  Playwright Test Execution                               │
│                                                          │
│  Run All Tests (Headless – CI parity)                    │
│  • npm test                                              │
│                                                          │
│  Run UI Tests (Headed – Debug/Demo)                      │
│  • npx playwright test src/ui --headed                   │
│                                                          │
│  Debug Mode (Inspector)                                  │
│  • PWDEBUG=1 npx playwright test src/ui                  │
│                                                          │
│  Run API Tests Only                                      │
│  • npx playwright test src/api                           │
└──────────────────────────────────────────────────────────┘
            │
            ▼
┌──────────────────────────────────────────────────────────┐
│  Local C# COST API (Integration Testing)                 │
│  • cd enterprise-data-simulation/csharp-api              │
│  • dotnet run                                            │
│  • In-memory repository                                  │
│  • http://localhost:5050/api/costs                       │
└──────────────────────────────────────────────────────────┘
            │
            ▼
┌──────────────────────────────────────────────────────────┐
│  Data Validation (Snowflake-style)                       │
│  • raw_costs.json                                        │
│  • snowflake_fact_costs.json                             │
│  • node validateTransformation.js                        │
└──────────────────────────────────────────────────────────┘
            │
            ▼
┌──────────────────────────────────────────────────────────┐
│  Reports & Utilities                                     │
│  • Playwright HTML report: npm run report                │
│  • Selenium example: npm run test:selenium               │
└──────────────────────────────────────────────────────────┘
enterprise-automation-framework
├─ src
│  ├─ ui
│  │  ├─ playwright
│  │  │  ├─ tests
│  │  │  │  └─ login.saucedemo.spec.js
│  │  │  └─ pages
│  │  └─ selenium
│  │     ├─ tests
│  │     │  └─ google.search.test.js
│  │     └─ pages
│  ├─ api
│  │  └─ tests
│  │     └─ user.api.spec.js
│  ├─ utils
├─ enterprise-data-simulation
├─ .github/workflows/ci.yml
├─ playwright.config.js
├─ package.json
├─ package-lock.json
└─ README.md
