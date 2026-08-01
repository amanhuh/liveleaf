<div align="center">

# 🌿 LiveLeaf

**A modern, lightning-fast document workspace engineered for speed, fluid organization, and distraction-free writing.**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-7.8-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Architecture & Directory Structure](#-architecture--directory-structure)
- [Database Schema & Performance](#-database-schema--performance)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Available Scripts](#-available-scripts)
- [License](#-license)

---

## 🌟 Overview

**LiveLeaf** is a full-featured, Notion-inspired document management platform designed to deliver desktop-grade performance in the browser. Featuring real-time debounced autosave, recursive page nesting, drag-and-drop reordering, full-text search, and cross-platform keyboard shortcuts, LiveLeaf provides a frictionless writing workspace.

---

## ✨ Key Features

### ✍️ Rich-Text & Editor Core
- **Tiptap Block Engine**: Built on Tiptap v3 with custom extensions for blockquotes, typography, code blocks, highlighting, and inline formatting.
- **Real-Time Autosave**: Background sync with status indicators (`Saving...` / `Saved`) and local state synchronization.
- **Full-Width Canvas Toggle**: Dynamic workspace mode switching between reading view and full-width editor canvas.
- **Live Character & Word Counter**: Real-time document statistics footer (`X words · Y characters`).
- **Export & Portability**: Export pages directly as Markdown (`.md`) or copy formatted page content in one click.

### 🌲 Recursive Tree Hierarchy & Drag-and-Drop
- **Unlimited Document Nesting**: Notion-style recursive hierarchy allowing pages to contain subpages indefinitely.
- **Desktop-Class Drag & Drop**: Powered by `@dnd-kit/core` and `@dnd-kit/sortable` with real-time visual depth projection indicators and drop-target positioning (before, after, or nest).
- **Starred Favorites**: Database-persisted favorites section with instant hover actions.

### 🔍 Command Palette & Full-Text Search
- **Instant Search (`Ctrl+K` / `⌘K`)**: Powered by PostgreSQL `tsvector` and `pg_trgm` indexes for fast searching across page titles and body snippets.
- **Highlight Matches**: Smart query term highlighting in search result previews.

### 🗑️ Soft-Delete & Trash Management
- **Archiving & Recovery (`Ctrl+Shift+T` / `⌘⇧T`)**: Soft-delete system with a dedicated Trash Modal supporting tree-aware document restoration and permanent deletion.

### ⌨️ Cross-Platform UX & Accessibility
- **Native OS Keyboard Badges**: Automatically detects Windows/macOS platforms (`Ctrl` vs. `⌘`) rendering clean `<Kbd>` components.
- **Shortcuts Panel**: Dedicated Keyboard Shortcuts tab in Settings for rapid feature discovery.
- **Theme Support**: Seamless Dark/Light theme switching with `next-themes` and custom OKLCH color palettes.

---

## 🛠️ Tech Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Server Components & Actions) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) (Strict Mode) |
| **Database** | [PostgreSQL](https://www.postgresql.org/) with `pg_trgm` & `tsvector` |
| **ORM** | [Prisma 7.8](https://www.prisma.io/) with `@prisma/adapter-pg` |
| **Authentication** | [Better Auth](https://www.better-auth.com/) (Session management, password hashing) |
| **State & Cache** | [TanStack Query v5](https://tanstack.com/query) & [Zustand](https://zustand-demo.pmnd.rs/) |
| **Editor Core** | [Tiptap v3](https://tiptap.dev/) |
| **Drag & Drop** | [@dnd-kit](https://dndkit.com/) (`core`, `sortable`, `utilities`) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/), Lucide Icons |

---

## 📁 Architecture & Directory Structure

```
liveleaf/
├── prisma/
│   └── schema.prisma         # Database schema & indexes definition
├── public/                   # Static assets & icons
└── src/
    ├── app/                  # Next.js App Router (pages, layouts, API routes)
    │   ├── api/              # Document, Search, and User API endpoints
    │   └── d/[documentId]/   # Workspace document viewer routes
    ├── components/           # React components
    │   ├── editor/           # Tiptap rich-text editor components
    │   ├── landing/          # Public landing page components
    │   ├── modals/           # Search, Settings, and Trash dialogs
    │   ├── sidebar/          # Tree view, drag-and-drop items, and navigation
    │   └── ui/               # Shadcn UI primitives (Kbd, Tooltip, Dialog, etc.)
    ├── features/             # Feature-specific DTOs and business logic
    ├── hooks/                # Custom React hooks (shortcuts, document queries)
    ├── lib/                  # Utilities, Prisma client, and authentication setup
    └── stores/               # Zustand state stores (sidebar tree expansion)
```

---

## ⚡ Getting Started

### Prerequisites
- **Node.js**: `v20.0.0` or higher
- **Package Manager**: `pnpm` (v9+)
- **Database**: PostgreSQL database

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/liveleaf.git
cd liveleaf
pnpm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/liveleaf?schema=public"
BETTER_AUTH_SECRET="your-super-secret-key"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Database Migration & Setup
```bash
# Push Prisma schema to PostgreSQL
pnpm exec prisma db push

# Generate Prisma Client
pnpm exec prisma generate
```

### 4. Run Development Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `pnpm dev` | Starts the Next.js development server |
| `pnpm build` | Builds the production bundle |
| `pnpm start` | Runs the compiled production server |
| `pnpm lint` | Runs ESLint code style check |
| `pnpm tsc` | Runs TypeScript type checker (`--noEmit`) |

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.
