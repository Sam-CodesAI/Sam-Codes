---
name: ralph-loop
description: Orchestrate autonomous iterative coding loops (Ralph Loop / Ralph Wiggum methodology) that run tasks against PRD/sprint files continuously until all features, tests, and verifications pass without premature exit.
---

# Ralph Loop AI Autonomous Iteration Skill

The Ralph Loop methodology enables long-running, autonomous iterative development cycles. The agent reads tasks from a sprint/PRD document, implements changes, runs verifications, commits progress, and loops until completion.

## CLI Usage

Run a sprint markdown file autonomously with iteration limits:
```bash
ralph-loop SPRINT.md --max-iterations=10 --gemini-agent
```

## Continuous Iteration Pattern
1. **Plan & Task List:** Define atomic tasks in `SPRINT.md` or `tasks.md`.
2. **Execute Cycle:** Agent executes the top incomplete task.
3. **Verify:** Compile, lint, test, and run `coderabbit review --agent`.
4. **Checkpoint:** Commit verified progress to git.
5. **Loop:** Repeat until all criteria in the PRD are met.
