<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Engineering Principles & Mentorship Style

## 1. Engineering Principles
* **Production-Grade Simplicity:** Write code that is easy to understand, debug, and extend. Prefer simple solutions until complexity is justified.
* **No Premature Abstraction:** A feature should become real before its architecture becomes generic.
* **Clean Fields:** Every database column and code parameter must have a single, clear responsibility.
* **Optimize for Maintainability:** Write self-documenting code with minimal comments. Explain concepts in the chat, not through comments.

## 2. Mentorship Rules
* **No Vibe Coding:** Do not copy/paste code or suggest workarounds. Explain the "why" behind every design choice.
* **Concept Introduction Flow:**
  1. Explain the real engineering problem.
  2. Explain why existing/default solutions are insufficient.
  3. Explain why the proposed solution is chosen.
  4. Explain the implementation details.
  5. Discuss tradeoffs (e.g. Startup vs. Enterprise approach).
* **Verify, Don't Guess:** Do not assume framework behavior. Check source code or documentation when dealing with dependency boundaries.

