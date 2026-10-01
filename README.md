# E-commerce API Test Automation Framework

## Overview

This is an API test automation framework for an e-commerce backend, built with Playwright and JavaScript. It targets [DummyJSON](https://dummyjson.com), a public mock e-commerce API, and covers products, authentication, and cart flows, including response schema validation and a CI pipeline.

The project is structured around a service layer that separates API calls from test logic, rather than making requests directly inside test files. This mirrors how test automation is structured on production QA teams, where tests are expected to stay readable and maintainable as the number of endpoints grows.

## Why this project exists

This project was built to practice API test automation the way it is done in real engineering teams, rather than writing isolated request and response checks. The focus areas are:

- A reusable API client and service layer instead of raw requests inside test files
- Token-based authentication handled explicitly in the code
- Response validation beyond status codes, including JSON schema checks
- Negative and edge case testing, not just happy paths
- A CI pipeline that runs the suite automatically on every push and pull request
- A structure that scales cleanly as more endpoints are added

## Tech stack

- Playwright (API testing and test runner)
- JavaScript (ES Modules)
- Node.js (v20 or later)
- Ajv (JSON schema validation)
- GitHub Actions (CI)

## Project structure

```
ecommerce-api-tests/
├── .github/
│   └── workflows/
│       └── api-tests.yml
├── tests/
│   ├── products/
│   │   └── products.spec.js
│   ├── auth/
│   │   └── auth.spec.js
│   └── cart/
│       └── cart.spec.js
├── services/
│   ├── productService.js
│   ├── authService.js
│   └── cartService.js
├── fixtures/
│   └── test-fixtures.js
├── schemas/
│   └── product.schema.json
├── utils/
│   ├── apiClient.js
│   └── validateSchema.js
├── playwright.config.js
├── package.json
└── README.md
```

## Architecture

- `utils/apiClient.js` creates a single Playwright request context with the base URL and headers configured in one place. Every service uses this instead of managing its own headers or base URL.
- `services/` contains one class per API resource (Product, Auth, Cart). Tests call service methods instead of calling the API directly, which keeps request logic out of test files and reusable across tests.
- Services that require authentication (Cart) accept an access token through their constructor. Public services (Product) do not. This makes the authentication requirement of each service explicit in the code itself, not just in documentation.
- `fixtures/test-fixtures.js` extends Playwright's base test with custom fixtures (`productService`, `authenticatedCart`) so test files never write their own setup or teardown. A test simply declares the fixture it needs as a parameter, and Playwright handles creation and cleanup automatically.
- `utils/validateSchema.js` wraps Ajv to validate API responses against JSON Schema files in `schemas/`, catching breaking changes to response shape instead of relying on manual field-by-field assertions.
- Tests are organized by domain (`products`, `auth`, `cart`) rather than by test type, so related tests stay grouped together.

## Prerequisites

- Node.js v20 or later (Playwright 1.63+ requires it; the CI workflow is pinned to Node 20)
- npm

## Installation

```
git clone <repository-url>
cd ecommerce-api-tests
npm install
```

## Configuration

Create a `.env` file in the project root (not committed to the repository):

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

## Test coverage

**Products**

- List all products
- Get a product by ID
- Get a non-existent product (404)
- Response schema validation against `schemas/product.schema.json`

**Auth**

- Login with valid credentials returns an access token
- Login with an incorrect password returns 400
- Login with a non-existent username returns 400

**Cart**

- Add a cart for the logged-in user
- Get carts for the logged-in user
- Get carts for a user with no cart returns 404 (this API treats a lookup with no match as not found, rather than returning an empty list)

## CI/CD

`.github/workflows/api-tests.yml` runs the full suite on every push and pull request to `main`, using Node 20. The Playwright HTML report is uploaded as a build artifact on every run, pass or fail, so failures can be inspected without re-running locally.

## Roadmap

- Extend schema validation to Auth and Cart responses
- Decide on a design for checkout flow testing, since DummyJSON has no real checkout endpoint; the closest existing analog is the cart `add` call already covered
- Add idempotency tests (for example, submitting the same cart or order request twice)
- Add more negative and boundary cases (malformed payloads, invalid product IDs in a cart request)

## Notes

- DummyJSON does not enforce authentication on its cart endpoints, so requests succeed even with an invalid token. The token handling in this project is written the way it would be for an API that does enforce it, so the same pattern applies directly to a real backend.
- Login failures on DummyJSON return 400, not the more conventional 401, for invalid credentials.
- Not every endpoint follows the same not-found convention. `GET /carts/user/:userId` returns 404 when there is no match, while some other filtered list endpoints on this API return 200 with an empty result. This was confirmed by running the actual tests rather than assumed, and is worth checking directly on any new endpoint rather than assuming a pattern.
