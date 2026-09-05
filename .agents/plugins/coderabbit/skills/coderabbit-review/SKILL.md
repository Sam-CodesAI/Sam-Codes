---
name: coderabbit-review
description: Run automated AI code reviews, diff inspections, and security/quality checks using the installed CodeRabbit CLI (coderabbit / cr). Use before committing changes or opening pull requests.
---

# CodeRabbit Review & Code Quality Skill

Use this skill to execute automated reviews and enforce code health using the CodeRabbit CLI.

## Commands

- Run interactive review:
  ```bash
  cr review
  ```
- Run machine-readable review for agentic processing:
  ```bash
  coderabbit review --agent
  ```
- Authenticate:
  ```bash
  coderabbit auth login
  ```
- View statistics:
  ```bash
  coderabbit stats
  ```
