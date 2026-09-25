---
title: "One night, one agent session, the rest of a weekly quota"
date: 2026-09-25T12:00:00+03:00
kind: incident
summary: "A supervising agent was woken 211 times in six hours. Each wake-up re-read a ~240K-token context."
timeline:
  - t: "BROKE"
    text: "Codex weekly usage went from 22% to 100% between 21 and 25 Sep"
  - t: "CAUSE"
    text: "Every permission prompt from a Claude Code worker woke the Hermes session that supervised it: 211 wake-ups, 808 API calls, ~240K context each"
  - t: "FIX"
    text: "A supervisor script now answers routine prompts without a model and wakes the agent only for plans, questions, results and denials"
  - t: "PROOF"
    text: "Unit tests for the supervisor; the old wait script kept for rollback"
---

Per-turn budgets never fired, because no single turn was expensive. The
cost was spread across hundreds of small wake-ups, each one paying for the
whole context again. The mechanism was cross-turn, so the guard had to be
too.
