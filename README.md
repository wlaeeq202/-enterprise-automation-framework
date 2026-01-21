# Enterprise Automation Framework

> Hybrid **UI + API** automation framework using **Playwright**, **Selenium WebDriver**, and **GitHub Actions CI**.  
> Built to showcase modern SDET skills for enterprise-grade testing.

![CI Status](https://github.com/wlaeeq202/-enterprise-automation-framework/actions/workflows/ci.yml/badge.svg)

---

## ⭐ Overview

This repository contains a **full-stack automation framework** designed to demonstrate:

- Modern **UI automation** using **Playwright**
- **API testing** (GET / POST / PATCH / DELETE) using Playwright's `request` fixture
- **Selenium WebDriver** example for classic UI testing
- **Node.js + npm** project structure
- **Continuous Integration** using **GitHub Actions**

It is intentionally structured like a real enterprise project so it can be used as a portfolio repo for interviews and technical discussions.

---

## 🧰 Tech Stack

- **Language:** Node.js (JavaScript)
- **UI Automation (modern):** [Playwright Test](https://playwright.dev/)
- **UI Automation (classic):** [Selenium WebDriver](https://www.selenium.dev/)
- **API Testing:** Playwright `request` fixture against a public API
- **Test Runner / Reporter:** Playwright Test + HTML report
- **CI/CD:** GitHub Actions
- **Package Manager:** npm

---

---

## 🎯 Alignment with Angular • C# • SQL • Snowflake Roles

This framework is designed to be **technology-agnostic on the backend**, but the patterns map directly to an Angular + C# + SQL + Snowflake stack:

- **Angular Frontend:**  
  UI automation is built with **Playwright + Page Object Model (POM)**.  
  The same patterns (locators, components, POM, fixtures) apply to testing Angular components, routing, forms, guards, and API-driven UI.

- **C# Backend / APIs:**  
  API tests use Playwright’s `request` fixture and validate REST endpoints, status codes, payloads, and error handling.  
  In a real C# backend, these tests would point to the COST API endpoints and validate business rules, auth, and contracts.

- **SQL / Snowflake:**  
  While this repo does not connect directly to Snowflake, the test strategy includes:
  - validating API responses against database expectations  
  - using query-style checks and data consistency assertions  
  - treating Snowflake as a source of truth for reporting / analytics validation.

See [`docs/test-strategy-cost-app.md`](docs/test-strategy-cost-app.md) for a concrete test strategy for an Angular + C# + SQL + Snowflake application.

---

## 🧩 Enterprise Data Simulation (C# • SQL • Snowflake-style)

To better align with roles that use **C# + SQL + Snowflake**, this repository includes a small, self-contained **enterprise data simulation** under:

```text
enterprise-data-simulation/
 ├─ csharp-api/      # C# minimal API simulating a COST microservice
 ├─ database/        # SQL schema + seed script for Costs table
 └─ snowflake/       # Snowflake-style aggregation + validation script



## 📁 Project Structure

```text
enterprise-automation-framework
├─ src
│  ├─ ui
│  │  ├─ playwright
│  │  │  ├─ tests
│  │  │  │  └─ login.saucedemo.spec.js      # Playwright UI test (SauceDemo login)
│  │  │  └─ pages                            # (reserved for Page Object Model)
│  │  └─ selenium
│  │     ├─ tests
│  │     │  └─ google.search.test.js        # Selenium + Chrome example test
│  │     └─ pages                            # (reserved for Selenium POM)
│  ├─ api
│  │  └─ tests
│  │     └─ user.api.spec.js                # Playwright API tests (GET/POST/PATCH/DELETE)
│  └─ utils                                  # (reserved for helpers, config, etc.)
├─ .github
│  └─ workflows
│     └─ ci.yml                              # GitHub Actions CI pipeline
├─ playwright.config.js                      # Playwright configuration
├─ package.json
├─ package-lock.json
└─ README.md