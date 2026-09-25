---
title: "Anatomy of a quota burn"
date: 2026-09-25T15:00:00+03:00
kind: research
tone: sun
deck: "How one agent session spent the last 110 million tokens of a weekly quota overnight — and why no per-turn budget noticed."
summary: "Metadata-only investigation of a weekly Codex quota going from 22% to 100% in four days, and the supervisor change that followed."
facts:
  - label: "METHOD"
    value: "Read-only SQLite snapshots and agent logs. Token counts and timings only, no message content."
  - label: "WINDOW"
    value: "21 Sep 06:00 → 25 Sep 07:05 UTC, 4.05 days."
  - label: "RESULT"
    value: "A supervisor that answers routine worker prompts without calling a model."
---

{{< stats >}}
22% → 100% | weekly quota used, 21 → 25 Sep
406M | tokens in the window, 93% of them cache reads
211 | background wake-ups of one session in six hours
~240K | tokens of context re-read on every wake-up
{{< /stats >}}

{{< chapter n="01" title="Most of it was an ordinary week" >}}
The first suspicion was one bad night. The logs said otherwise: about
three quarters of the quota was gone before that night, spent on ordinary
daytime work across three agent profiles.

{{< bars title="Tokens per day, all profiles" unit="M" >}}
21 Sep | 96
22 Sep | 50
23 Sep | 51
24 Sep | 128
25 Sep, 00:00–03:06 | 69 | the night
{{< /bars >}}

The night added the last ≈110M — enough to finish the quota, not enough to
explain it alone.
{{< /chapter >}}

{{< chapter n="02" title="One session, woken 211 times" tone="coral" >}}
The session that tipped it over was supervising a Claude Code worker. The
pattern was: start a background watcher, end the turn, get woken when the
worker changes state. The worker was in plan mode and asked for approval
every one or two minutes. Every question ended the watcher, and every end
of the watcher woke the supervisor with a fresh turn.

{{< bars title="API calls per hour, 24 Sep 19:00 → 25 Sep 01:05 UTC" unit="" >}}
19:00 | 44
20:00 | 199
21:00 | 154
22:00 | 118
23:00 | 158
00:00 | 116
01:00 | 19 | quota gone
{{< /bars >}}

Each wake-up ran three or four calls — far below the per-turn limit of 90.
**No single turn was expensive**, so no per-turn budget ever fired. The
loop lived across turns.
{{< /chapter >}}

{{< chapter n="03" title="The context never shrank" tone="lilac" >}}
Every one of those calls re-read the whole conversation: the per-call
context grew from about 100K to about 243K tokens and stayed there.
Compression ran 37 times and made no progress 37 times; each failed pass
also duplicated the transcript on disk.

{{< callout label="THE ACTUAL BUG" >}}
A cheap event (a worker asked a routine question) was answered by an
expensive actor (a model re-reading 240K tokens). The fix is to stop
waking the model for events that do not need judgment.
{{< /callout >}}
{{< /chapter >}}

{{< chapter n="04" title="What changed" tone="lime" >}}
The root cause was a skill change two weeks earlier: workers moved from an
auto-approve permission mode to plan mode, which prompts for each shell
command — and each prompt woke the supervisor.

The fix is a small supervisor script that sits between the worker and the
agent. It answers routine prompts itself, keeps a deny-list for pushes,
deploys and destructive operations, and wakes the agent only for a ready
plan, a real question, a finished job, a denial, a stuck worker or a
budget cap. It has unit tests, and the old watcher is kept for rollback.

{{< flow >}}
Worker | asks for approval, or changes state
Supervisor | routine? answer it without a model
Agent | woken only for plans, questions, results, denials
{{< /flow >}}
{{< /chapter >}}
