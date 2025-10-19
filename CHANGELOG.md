# Changelog

All notable changes to TransactBD will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- ESLint v9 configuration with flat config format
- GitHub Actions CI/CD pipeline
- Improved project configuration files (.editorconfig, enhanced .prettierrc)
- Contributing guidelines
- Enhanced gitignore for better workspace management

### Changed
- Updated development dependencies for better compatibility
- Improved code formatting standards

### Fixed
- Fixed ESLint v9 migration issues across all packages
- Resolved SSLCommerz test failures
- Improved type safety and linting rules

## [1.0.1] - 2024-10-19

### Added
- Initial monorepo setup with Turbo
- Core HTTP client with retry and timeout functionality
- Payment gateway interfaces and base classes
- SSLCommerz integration
- bKash integration with token caching
- Nagad integration with RSA signature verification
- Express.js webhook helpers
- Example Express application
- TypeScript configuration and type definitions
- Testing setup with Vitest and nock
- ESLint and Prettier configuration
- Package publishing scripts

### Features
- Unified payment gateway interface
- Type-safe HTTP client with automatic retries
- Idempotency key handling
- Webhook signature verification
- Comprehensive error handling
- Support for multiple Bangladesh payment gateways

### Documentation
- README files for all packages
- Installation and usage instructions
- API documentation
- Example implementations