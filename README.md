# TestCase Manager

A comprehensive test case management system for software quality assurance teams.

## Overview

TestCase Manager is a modern, scalable test case management platform built with a monorepo architecture. It provides tools for creating, organizing, and executing test cases, tracking test results, and generating comprehensive reports.

## Project Structure

This is a monorepo managed by [Turborepo](https://turbo.build/). It contains the following workspace categories:

```
testcase-manager/
├── apps/           # Frontend applications
├── packages/       # Shared packages and libraries
├── services/       # Backend services and APIs
└── turbo.json      # Turborepo configuration
```

### Workspaces

- **apps/** - Frontend applications (web app, documentation site, etc.)
- **packages/** - Shared packages (UI components, utilities, types, etc.)
- **services/** - Backend services (API server, workers, etc.)

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build all packages and apps
npm run build

# Run tests
npm run test

# Run linting
npm run lint
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run build` | Build all packages and applications |
| `npm run dev` | Start development servers |
| `npm run lint` | Run linting across all workspaces |
| `npm run test` | Run tests across all workspaces |
| `npm run format` | Format code with Prettier |
| `npm run type-check` | Run TypeScript type checking |
| `npm run clean` | Clean build artifacts and node_modules |

## License

Apache-2.0

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting pull requests.
