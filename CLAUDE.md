# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is the documentation repository for Legend's open-source projects, containing both legacy Astro-based documentation and a new FumaDocs-based migration. The repository serves documentation for Legend-State, Legend-Motion, and Legend-List projects.

## Dual Documentation Architecture

### Legacy Astro Documentation (`packages/`)
- **Location**: Monorepo workspace packages in `packages/` directory
- **Framework**: Astro with Starlight theme, React-Live for interactive examples
- **Packages**: `state/`, `motion/`, `list/`, `state-v2/`, `shared/`
- **Status**: Original documentation system, still functional

### New FumaDocs Migration (`docs/`)
- **Location**: Standalone Next.js application in `docs/` directory 
- **Framework**: FumaDocs with Next.js 15, TypeScript, Tailwind CSS
- **Purpose**: Modern documentation platform with versioned docs and improved navigation

## Development Commands

### FumaDocs (New System)
```bash
# Run FumaDocs development server
cd docs
bun dev

# Build FumaDocs for production  
cd docs
bun build

# Start production server
cd docs
bun start
```

### Legacy Astro Documentation
```bash
# Run individual package docs (legacy)
cd packages/state
bun i && bun dev

cd packages/motion  
bun i && bun dev

cd packages/list
bun i && bun dev
```

## FumaDocs Architecture

### Multi-Package Structure
The FumaDocs implementation supports multiple documentation packages with versioned content:

- **Package Routes**: `/list` and `/state` with dedicated homepages
- **Versioned Documentation**: `/list/docs/v1`, `/list/docs/v2`, `/state/docs/v1`, `/state/docs/v2`
- **Unified Navigation**: Custom navbar with "Home", "List", "State" links

### Source Configuration
- **`source.config.ts`**: Defines separate document collections (`listDocs`, `stateDocs`) for package-specific content
- **Generated Sources**: Auto-generated `.source/index.ts` with runtime document mapping
- **Package Sources**: `src/lib/sources/list.ts` and `src/lib/sources/state.ts` filter content for each package

### Custom Navigation System
- **Custom Navbar**: `src/components/navbar.tsx` replaces default FumaDocs navigation
- **Layout Integration**: Custom navbar injected into docs layouts with `nav={{ component: <CustomNavbar /> }}`
- **Sidebar Tabs**: Version switching (V1/V2) implemented using FumaDocs sidebar tabs

### Content Organization
```
docs/content/
├── list/
│   ├── v1/index.mdx + meta.json  
│   └── v2/index.mdx + meta.json
└── state/
    ├── v1/index.mdx + meta.json
    └── v2/index.mdx + meta.json
```

### Route Structure
```
docs/src/app/
├── list/
│   ├── page.tsx (homepage)
│   └── docs/[[...slug]]/page.tsx (versioned docs)
├── state/  
│   ├── page.tsx (homepage)
│   └── docs/[[...slug]]/page.tsx (versioned docs)
└── layout.config.tsx (shared navigation config)
```

## Key Configuration Files

### FumaDocs
- **`source.config.ts`**: Document collections and MDX configuration
- **`next.config.mjs`**: Next.js configuration with FumaDocs optimizations  
- **`src/lib/sources/*.ts`**: Package-specific source loaders
- **`src/app/layout.config.tsx`**: Shared layout and navigation configuration

### Legacy Astro
- **`astro.config.mjs`**: Astro and Starlight configuration (per package)
- **`tailwind.config.cjs`**: Tailwind CSS configuration (per package)

## Package Manager

Uses **bun** as the primary package manager across both systems. The FumaDocs system includes `postinstall: "fumadocs-mdx"` for automatic source generation.

## Version Management

FumaDocs implements version tabs using `meta.json` files with `"root": true` property to create sidebar tab navigation between documentation versions. Each package maintains separate V1 and V2 documentation branches.