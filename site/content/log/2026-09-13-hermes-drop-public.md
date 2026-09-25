---
title: "Hermes Drop is public"
date: 2026-09-13T12:00:00+03:00
kind: log
summary: "A self-hosted broker and Hermes plugin for handing an agent a secret without putting it in the chat. MIT, not security-audited."
thing: "/things/hermes-drop/"
---

I wanted a Hermes agent to receive a credential or a file without either
one ever landing in the conversation. Asking for a secret in chat means the
secret is now in the chat — in the transcript, in the logs, in whatever the
model keeps.

So the agent posts a short-lived link instead. The browser encrypts what
you send, the broker holds it, and the agent is woken when it arrives. The
link has no destination field at any depth, which turned out to be a much
better boundary than validating a destination the model supplied.

The full write-up, with the threat model and what it does not do, is on
the [project page](/things/hermes-drop/).
