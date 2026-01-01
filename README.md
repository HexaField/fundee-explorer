# Fundee Explorer

**Fundee Explorer** is a tool designed to visualize the "invisible" funding ecosystem of NPM packages. It helps developers discover which dependencies in their supply chain are seeking financial support, making it easier to contribute back to the open-source community.

## Features

- **Ecosystem Mapping**: Enter any NPM package name to generate a nested, "holonic" map of its dependencies.
- **Funding Discovery**: Identify packages that have funding channels (GitHub Sponsors, Open Collective, Tidelift, etc.).
- **Deep Analysis**: The backend dynamically installs and analyzes the package dependency tree to find funding information even for deep dependencies.
- **Clean UI**: A minimalist, commons-oriented interface built with SolidJS and Tailwind CSS.

## Tech Stack

This project is a monorepo managed with **pnpm workspaces**.

- **Frontend**: [SolidJS](https://www.solidjs.com/), [Vite](https://vitejs.dev/), [Tailwind CSS](https://tailwindcss.com/)
- **Backend**: [Node.js](https://nodejs.org/), [Express](https://expressjs.com/)
- **Tooling**: TypeScript, ESLint, Prettier, Vitest, Playwright

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- pnpm

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/HexaField/fundee-explorer.git
   cd fundee-explorer
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

### Running the Application

Start both the client and server in development mode:

```bash
pnpm dev
```

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001

## Project Structure

```
fundee-explorer/
├── packages/
│   ├── client/       # SolidJS frontend application
│   ├── server/       # Express backend service
│   └── core/         # Shared types and utilities
├── package.json      # Root configuration
└── pnpm-workspace.yaml
```

## How it Works

1. **Request**: The user enters a package name in the frontend.
2. **Analysis**: The backend creates a temporary workspace, installs the package, and runs `npm fund --json`.
3. **Response**: The hierarchical funding data is sent back to the client.
4. **Visualization**: The frontend renders the dependency tree, highlighting packages with funding links.

## License

[MIT](LICENSE)
