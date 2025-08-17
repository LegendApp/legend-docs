# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is the documentation repository for Legend's open-source projects, primarily Legend-State and Legend-Motion. The documentation is built using Astro with Starlight, featuring live code editing via React-Live and React component examples.

## Package Structure

This is a monorepo with the following workspace packages:

- `packages/state/` - Legend-State documentation (main docs site)
- `packages/motion/` - Legend-Motion documentation 
- `packages/list/` - Legend-List documentation
- `packages/state-v2/` - Alternative version of state docs
- `packages/shared/` - Common components and utilities shared across all docs

## Development Commands

### Running the Documentation

Each package can be run independently. Use bun as the package manager:

```bash
# For Legend-State docs (most common)
cd packages/state
bun i
bun dev

# For Legend-Motion docs
cd packages/motion
bun i  
bun dev

# For Legend-List docs
cd packages/list
bun i
bun dev
```

### Building for Production

```bash
# Standard build
bun build

# Build for Legend website deployment (state docs)
cd packages/state
bun publish
```

### Development Server Options

- `bun dev` - Standard development server
- `bun devlegend` - Development with Legend-specific publishing flags (state package only)

## Architecture

### Documentation Framework
- **Astro** with **Starlight** theme for static site generation
- **React** components for interactive examples
- **React-Live** for live code editing capabilities
- **Tailwind CSS** for styling with custom configurations

### Content Organization
- Documentation content is in MDX format located in `src/content/docs/`
- Interactive examples are React components in `src/Components/`
- Shared components and utilities live in the `shared` package
- Assets (videos, images, fonts) are in `src/assets/` and `public/`

### Key Configuration Files
- `astro.config.mjs` - Astro and Starlight configuration with custom sidebar structure
- `tailwind.config.cjs` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- Package-specific configurations exist in each workspace

### Content Structure
Each documentation package follows this pattern:
- `intro/` - Introduction and getting started guides
- `usage/` - Core usage documentation  
- `react/` - React-specific guides and examples
- `guides/` - Advanced guides and patterns
- `sync/` - Persistence and synchronization (state docs)
- `other/` - Migration guides and framework comparisons

### Component Architecture
- Astro components (`.astro`) for static content and layouts
- React components (`.tsx`) for interactive examples and live demos
- Shared components imported from the `shared` workspace
- Custom Starlight overrides in `src/Components/Overrides/`

## Package Manager

This project uses **bun** as the primary package manager. While other package managers might work, bun is explicitly mentioned in the README and used in the lock files.

## Live Examples

The documentation features interactive examples that can be edited in real-time using React-Live. These are typically structured as paired `.astro` and `.tsx` files where the Astro file handles the layout and the React component provides the interactive functionality.