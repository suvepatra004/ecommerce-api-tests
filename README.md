# E-commerce API Test Automation Framework

## Overview

This is an API test automation framework for an e-commerce backend, built with Playwright and JavaScript. It targets [DummyJSON](https://dummyjson.com), a public mock e-commerce API, and covers products, authentication, and cart flows.

The project is structured around a service layer that separates API calls from test logic, rather than making requests directly inside test files. This mirrors how test automation is structured on production QA teams, where tests are expected to stay readable and maintainable as the number of endpoints grows.

## Why this project exists

This project was built to practice API test automation the way it is done in real engineering teams, rather than writing isolated request and response checks. The focus areas are:

- A reusable API client and service layer instead of raw requests inside test files
- Token-based authentication handled explicitly in the code
- Response validation beyond status codes
- Negative and edge case testing, not just happy paths
- A structure that scales cleanly as more endpoints are added

## Tech stack

- Playwright (API testing and test runner)
- JavaScript (ES Modules)
- Node.js

## Project structure

```
ecommerce-api-tests/
├── .github/
│   └── workflows/
│       └── api-tests.yml
├── tests/
│   ├── auth/
│   ├── products/
│   └── cart/
├── services/
│   ├── authService.js
│   ├── productService.js
│   └── cartService.js
├── utils/
│   └── apiClient.js
├── schemas/
├── fixtures/
├── config/
│   └── playwright.config.js
├── package.json
└── README.md
```

## Architecture

- `utils/apiClient.js` creates a single Playwright request context with the base URL and headers configured in one place. Every service uses this instead of managing its own headers or base URL.
- `services/` contains one class per API resource (Product, Auth, Cart). Tests call service methods instead of calling the API directly, which keeps request logic out of test files and reusable across tests.
- Services that require authentication (Cart) accept an access token through their constructor. Public services (Product) do not. This makes the authentication requirement of each service explicit in the code itself, not just in documentation.
- Tests are organized by domain (`products`, `auth`, `cart`) rather than by test type, so related tests stay grouped together.

## Prerequisites

- Node.js v18 or later
- npm

## Installation

```
git clone <repository-url>
cd ecommerce-api-tests
npm install
```

## Configuration

Create a `.env` file in the project root:

```
BASE_URL=https://dummyjson.com
```

## Running tests

Run the full suite:

```
npx playwright test
```

Run a specific file:

```
npx playwright test tests/products/products.spec.js
```

Run tests matching a name:

```
npx playwright test -g "products"
```

## Viewing the report

```
npx playwright show-report
```

## Current test coverage

- Products: list all products, get product by ID, get a non-existent product (404)
- Auth: login and access token retrieval
- Cart: add cart, get cart by user (in progress)

## Roadmap

- Add JSON schema validation for product and cart responses
- Add fixtures for reusable test data and setup/teardown
- Add negative and idempotency tests for cart and checkout flows
- Add a GitHub Actions workflow to run the suite on every push
- Add structured reporting for CI runs

## Notes

DummyJSON does not enforce authentication on its cart endpoints, so requests will succeed even with an invalid token. The token handling in this project is written the way it would be for an API that does enforce it, so the same pattern applies directly to a real backend.
