---
title: "Hermes Drop: asking for a secret without putting it in chat"
date: 2026-09-13
summary: "A secret should not live in the same conversation that asks for it."
tags: ["PYTHON", "HERMES", "SECRETS"]
repo: "https://github.com/dmmeteo/hermes-drop"
annotation: "this one is public"
factsTitle: "FROM THE README"
facts:
  - label: "WHAT IT IS"
    value: "A self-hosted broker plus a Hermes plugin. MIT licensed."
  - label: "WHAT IT IS NOT"
    value: "Not end-to-end encryption — the broker holds the decryption key by design."
  - label: "AUDIT"
    value: "No formal or third-party security audit."
  - label: "READ FIRST"
    value: "The threat model and limitations, both in the repo."
---

I wanted a Hermes agent to be able to receive a credential or a file
without either one ever landing in the conversation. Asking for a secret
in chat means the secret is now in the chat — in the transcript, in the
logs, in whatever the model keeps.

Hermes Drop is two self-hosted pieces: a small broker service, and a
Hermes plugin with a stock `/drop` skill command. The agent posts a
short-lived link into the conversation it is already in, the browser
encrypts what you send, and the agent is woken when it arrives. It works
in both directions — the agent can hand you a secret the same way.

The part I keep coming back to is that the link has no destination field.
Not in the command, not in the tool schema — no platform, channel or
thread at any depth. A model that cannot express a destination cannot
pick the wrong one. That turned out to be a much better boundary than
validating a destination the model supplied.

## What it does not do

It is not end-to-end encrypted. The broker holds the decryption key by
design, and the Hermes host, the broker process and the model are all
trusted with the plaintext. It has had no formal or third-party security
audit — it was built against a written threat model and has substantial
automated test coverage, including RFC 9180 test vectors, but that is not
the same thing, and the underlying HPKE library says the same of itself.

Read the threat model and the limitations before trusting it with
anything that matters.
