# Contributing to TransactBD

Thank you for your interest in contributing to TransactBD! This document provides guidelines and information for contributors.

## Getting Started

### Prerequisites

- Node.js 18, 20, or 22
- pnpm 9.0.0 or later

### Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/transactbd.git
   cd transactbd
   ```
3. Install dependencies:
   ```bash
   pnpm install
   ```
4. Build all packages:
   ```bash
   pnpm build
   ```

## Development Workflow

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests for a specific package
pnpm --filter @transactbd/core test

# Run tests with coverage
pnpm coverage
```

### Type Checking

```bash
# Run type checks for all packages
pnpm typecheck

# Run type checks for a specific package
pnpm --filter @transactbd/core typecheck
```

### Linting

```bash
# Run linting for all packages
pnpm lint

# Run linting for a specific package
pnpm --filter @transactbd/core lint
```

### Building

```bash
# Build all packages
pnpm build

# Build a specific package
pnpm --filter @transactbd/core build
```

## Project Structure

```
transactbd/
├── packages/
│   ├── core/           # Core types, errors, and HTTP client
│   ├── sslcommerz/     # SSLCommerz gateway adapter
│   ├── bkash/          # bKash gateway adapter
│   ├── nagad/          # Nagad gateway adapter
│   └── express/        # Express.js webhook helpers
├── examples/
│   └── express-app/    # Example Express application
└── prompt/             # Demo and example files
```

## Code Standards

### TypeScript

- Use TypeScript for all new code
- Prefer explicit return types
- Use interfaces for object shapes
- Avoid `any` - use `unknown` or proper types
- Use JSDoc comments for public APIs

### ESLint & Prettier

- All code must pass ESLint checks
- Use Prettier for formatting
- Configure your editor to use the project's `.editorconfig`

### Testing

- Write tests for new functionality
- Use Vitest for unit tests
- Use nock for HTTP mocking
- Test both happy path and error cases

## Submitting Changes

1. Create a new branch: `git checkout -b feature/your-feature-name`
2. Make your changes
3. Add tests for new functionality
4. Ensure all tests pass: `pnpm test`
5. Ensure type checking passes: `pnpm typecheck`
6. Ensure linting passes: `pnpm lint`
7. Commit your changes with a clear message
8. Push to your fork: `git push origin feature/your-feature-name`
9. Create a pull request

## Commit Message Convention

Use conventional commit messages:

- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for refactoring
- `test:` for test changes
- `chore:` for maintenance tasks

Examples:
- `feat(bkash): add recurring payment support`
- `fix(sslcommerz): handle timeout errors properly`
- `docs: update installation instructions`

## Bug Reports

When filing bug reports, please include:

- Node.js version
- Package version
- Steps to reproduce
- Expected behavior
- Actual behavior
- Error messages or stack traces

## Feature Requests

Feature requests are welcome! Please provide:

- Clear description of the feature
- Use case and motivation
- Proposed API (if applicable)
- Examples of how it would be used

## Questions

If you have questions, feel free to:

- Open an issue for discussion
- Start a discussion in the repository
- Check existing issues and discussions

## License

By contributing to TransactBD, you agree that your contributions will be licensed under the MIT License.