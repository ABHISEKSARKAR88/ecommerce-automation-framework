# E-Commerce Automation Framework

An industry-style test automation framework built using JavaScript and Playwright Test, designed to demonstrate Senior QA Automation / SDET engineering practices.

## Project Objectives

- UI automation using Page Object Model (POM) and reusable fixtures
- REST API automation with authentication and reusable API clients
- PostgreSQL database validation and data integrity testing
- End-to-end verification across UI, API and database layers
- Parallel execution, test-suite selection and test isolation
- GitHub pull-request workflows and code reviews
- Jenkins CI/CD pipelines and quality gates
- Docker-based application and database infrastructure
- Debugging through HTML reports, screenshots, traces and logs

## Technology Stack

- JavaScript (CommonJS)
- Node.js and npm
- Playwright Test
- PostgreSQL
- Git and GitHub
- Jenkins
- Docker and Docker Compose

## Practice Applications

- **UI:** [SauceDemo](https://www.saucedemo.com/)
- **API:** [Restful Booker API documentation](https://restful-booker.herokuapp.com/apidoc/index.html)
- **Integration:** A locally controlled e-commerce application backed by PostgreSQL, to be implemented in later stages.

## Prerequisites

- Node.js and npm
- Git
- Chromium installed through Playwright

## Installation

Clone the repository and enter the project directory:

```bash
git clone https://github.com/ABHISEKSARKAR88/ecommerce-automation-framework.git
cd ecommerce-automation-framework
```

Install dependencies and the browser:

```bash
npm ci
npx playwright install chromium
```

## Running Tests

```bash
npm test
npm run test:headed
npm run test:debug
npm run test:list
npm run report
```

## Framework Development Roadmap

1. Project setup and GitHub foundation
2. UI automation, POM, fixtures and authentication
3. API automation and reusable clients
4. PostgreSQL and database validation
5. Local application and cross-layer integration
6. Parallel execution and suite selection
7. Jenkins CI/CD and pull-request workflows
8. Docker, reporting and quality gates

## Engineering Principles

- Clear separation of concerns
- Maintainable and reusable test components
- Reliable assertions and explicit test-data management
- Independent, parallel-safe tests
- Secure handling of credentials
- Actionable reports and failure diagnostics
- Reproducible execution locally and in CI

## Current Status

Initial Playwright configuration and a passing SauceDemo browser smoke test are implemented. Further framework capabilities will be added incrementally.
