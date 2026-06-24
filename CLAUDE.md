@AGENTS.md

Project Overview

LiveLeaf is a Notion-inspired document editor built with:

Next.js (App Router)
TypeScript
Tiptap
Zustand
Tailwind CSS
shadcn/ui

The goal is to build a polished document-first workspace focused on writing, hierarchy, and speed.

Current Features
Nested document tree
Create / Rename / Delete documents
Breadcrumb navigation
Tiptap editor
Slash commands
Bubble menu formatting
Local persistence
Development Principles

1. Production-Ready Simplicity

Write code that is:

Easy to understand
Easy to debug
Easy to extend

Prefer simple solutions until complexity is justified.

Avoid premature abstractions.

A feature should become real before its architecture becomes generic.

2. Product Before Architecture

Focus on user-facing improvements before technical complexity.

Prioritize:

Editor UX
Navigation
Search
Organization

Avoid premature optimization.

3. Minimize Dependencies

Before adding a dependency:

Check if existing libraries already solve the problem.
Prefer native browser APIs when reasonable.

4. Preserve Existing UX

When implementing new features:

Do not regress editor behavior.
Do not break keyboard navigation.
Do not introduce unnecessary rerenders.

5. Investigate Before Refactoring

Never rewrite working systems without evidence.

When debugging:

Reproduce.
Isolate.
Verify root cause.
Fix.
Validate.
Code Style
TypeScript
Avoid any.
Prefer explicit types.
Prefer type inference when obvious.
React
Functional components only.
Use hooks appropriately.
Avoid unnecessary effects.
State Management

Use Zustand for shared application state.

Keep editor state local unless synchronization is required.

Tiptap Rules

Before modifying editor behavior:

Check if StarterKit already supports it.
Prefer extensions over editor hacks.
Preserve keyboard accessibility.
Verify behavior using minimal reproductions.
Current Priorities
Global document search (Ctrl + K)
Sidebar polish
Keyboard shortcuts
Editor polish
Metadata support (createdAt, updatedAt)
Non-Priorities

Do not work on these unless explicitly requested:

Realtime collaboration
AI writing features
Comments
Permissions
Notifications
Complex database functionality
Output Expectations For Agents

When implementing features:

Explain the approach first.
Highlight tradeoffs.
Keep changes minimal.
Prefer production-ready solutions.
Avoid overengineering.