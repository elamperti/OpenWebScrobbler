# Guide for development Agents

This repository contains the frontend code for Open Scrobbler, a tool that allows users to scrobble tracks manually, from albums or from other musical sources.

## 1 · Project snapshot

| Area                | Choice                           |
| ------------------- | -------------------------------- |
| **Runtime**         | Node 24 (LTS)                    |
| **Frontend**        | React 19 + Vite 7 + TypeScript 5 |
| **Backend**         | Accessed through an API          |
| **Package manager** | yarn                             |
| **Testing**         | Vitest (unit), Cypress (E2E)     |
| **CI**              | GitHub Actions                   |

---

## 2 · Repo layout

```
/
├─ src/                # Frontend & shared client code
│  ├─ components/      # Common React components (PascalCase.tsx, .css)
│  ├─ domains/         # Feature domains
│  |  └─ ../           # Some domain (scrobbleAlbum, scrobbleSong, etc.)
│  |     └─ partials/  # Partial or-reused components
│  ├─ hooks/           # Custom React hooks (useX.ts)
│  ├─ store/           # Redux store, reducers, actions. (deprecated)
│  └─ utils/           # Utilities, helpers and types
│     └─ clients/      # API clients for backend and different services
├─ public/             # Static assets (favicon, manifest, etc.)
│  └─ locales/         # Localization files (JSON)
├─ cypress/            # Cypress config and tests
│  ├─ fixtures/        # Test data (mocked API responses)
│  └─ e2e/             # End-to-end tests
├─ .github/            # GitHub configs
│  └─ workflows/       # CI pipelines (GitHub Actions)
├─ .husky/             # Git hooks (pre-commit, etc.)
├─ assets/             # Reference media and other stuff (not used in production)
```

Agents **must not** write to `public/` and **must refrain** from touching `.github/` unless the task explicitly requires CI changes.

---

## 3 · Coding standards

### 3.1 Language & syntax

- Use TypeScript for type safety, but implicit types are fine where intent is obvious.
- Prefer type annotations for function signatures, public APIs, and complex objects.
- TS strict mode is not required, but aim for clear and maintainable types.
- Use modern javascript features; transpilation targets modern evergreen browsers.

### 3.2 Style

- 2‑space indent, single quotes, trailing commas **where valid**.
- Format with **Prettier** (`yarn prettier:fix`).
  Check linting with `yarn lint:fix` before committing.
- Easy to understand is better than clever. Even if it's marginally less efficient.

### 3.3 Naming

- Variables: `camelCase`; constants: `SCREAMING_SNAKE_CASE`.
- React components & files: `PascalCase`.
- Test files: `*.test.ts[x]` placed next to the implementation.

### 3.4 React

- Functional components with hooks only—*no class components*.
- Components and domains have their own directories, where there's an `index.ts` file that re-exports all the relevant components.
- If a view or component becomes too large, it should be split into smaller components or files.
  Store big parts not intended for reuse outside the view/component in a `partials/` subdirectory.
- **State**: prefer React Context or TanStack Query; avoid Redux unless justified.
- Side effects inside `useEffect` with clear dependency arrays.

### 3.5 Dependencies

- Think twice before adding dependencies.
- Disallowed: moment.js
- Use native APIs where possible. Rely on `date-fns` for date manipulation.

### 3.6 Accessibility (a11y)

- Use semantic HTML elements where possible.
- Provide descriptive `aria-label`s or roles for custom components.
- Avoid using color as the only means of conveying information.

### 3.7 Internationalization (i18n)

- All user-facing text must use the translation system (`react-i18next`).
- Do not hardcode strings in components; use translation keys.
- Support pluralization and variable interpolation in translations.
- Ensure date, time, and number formats are localized using appropriate libraries (e.g., `date-fns` with locale).

---

## 4 · Testing

| Level     | Tool                           | Notes                            |
| --------- | ------------------------------ | -------------------------------- |
| **Unit**  | Vitest + React‑Testing‑Library | Aim > 90 % critical paths        |
| **E2E**   | Cypress                        | Runs on Chromium & Firefox in CI |

- Place unit tests in a `*.test.ts` right next to source files.
- E2E tests live in `cypress/e2e`.
- All tests must be deterministic, idempotent, and clean up after themselves.
- Assume tests will run in different timezones.
- Avoid the "should" prefix in test names, start with verb phrases that describe the behavior being tested.
- Use real artists, albums, and track titles in tests instead of generic placeholders (when possible).

---

## 5 · Commit & PR rules

### Commits

Use **imperative** format: `Add feature`, `Fix bug`, `Refactor code`, etc.


### Pull Requests

- Title in imperative form, covering overall changes
- **Template sections**: *Motivation*, *Changes*, *Testing*

---

## 6 · Programmatic checks

CI executes:

```sh
yarn prettier:fix # Format code with Prettier
yarn test:unit    # Run all unit tests
yarn typecheck    # Ensure types are consistent
yarn lint         # Ensure code style is consistent
```

Agents **must run** these locally and push only green pipelines.


---

## 7 · Security & privacy

- Never commit `.env*` files or tokens.
- Sanitize all external input.
- Follow **OWASP Top‑10** recommendations.

---

## 8 · Documentation

- Update **README.md** when necessary.
- Keep inline comments to a minimum (only for complex logic).
- Use JSDoc for public functions and components.

---

Strict adherence to this guide ensures humans and AIs can collaborate efficiently and keep Open Scrobbler 🚀 performant and reliable.
