---
title: "Hermes Drop"
date: 2026-09-13T12:00:00+03:00
kind: project
tone: lilac
deck: "Ask an agent for a secret without putting the secret in the chat."
summary: "A self-hosted broker and Hermes plugin for handing a credential or a file to an agent — and back — without it landing in the conversation."
repo: "https://github.com/dmmeteo/hermes-drop"
aliases: ["/log/hermes-drop/"]
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

{{< chapter n="01" title="The problem" >}}
I wanted a Hermes agent to be able to receive a credential or a file
without either one ever landing in the conversation. Asking for a secret
in chat means the secret is now in the chat — in the transcript, in the
logs, in whatever the model keeps.
{{< /chapter >}}

{{< chapter n="02" title="How it works" tone="sky" >}}
Hermes Drop is two self-hosted pieces: a small broker service, and a
Hermes plugin with a stock `/drop` skill command.

{{< flow >}}
Agent | posts a short-lived link into the conversation it is already in
Browser | encrypts what you send before it leaves the page
Broker | holds the ciphertext until the agent claims it
Agent | is woken when it arrives — the secret never enters the transcript
{{< /flow >}}

It works in both directions — the agent can hand you a secret the same way.
{{< /chapter >}}

{{< chapter n="03" title="The boundary that worked" tone="lime" >}}
The part I keep coming back to is that the link has **no destination
field**. Not in the command, not in the tool schema — no platform, channel
or thread at any depth.

{{< callout label="DESIGN RULE" >}}
A model that cannot express a destination cannot pick the wrong one.
{{< /callout >}}

That turned out to be a much better boundary than validating a destination
the model supplied.
{{< /chapter >}}

{{< chapter n="04" title="What it does not do" tone="coral" >}}
It is not end-to-end encrypted. The broker holds the decryption key by
design, and the Hermes host, the broker process and the model are all
trusted with the plaintext. It has had no formal or third-party security
audit — it was built against a written threat model and has substantial
automated test coverage, including RFC 9180 test vectors, but that is not
the same thing, and the underlying HPKE library says the same of itself.

Read the threat model and the limitations before trusting it with anything
that matters.
{{< /chapter >}}
