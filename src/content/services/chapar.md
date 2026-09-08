---
title: chapar
description: A Nostr relay that only accepts chat events (NIP-59).
tagline: Chat-only relay for NIP-59 gift-wrapped events
type: relay
repo: https://github.com/dezh-tech/ddsr/tree/main/chapar
nips: [NIP-17, NIP-59]
media: []
order: 3
---

Chapar is a relay with a narrow job: it only accepts chat events — NIP-59 gift wrap and related kinds. Everything else is rejected, which keeps a private messaging backend lean by construction.

<!-- TODO: pairing with DM clients. Screenshot. -->

## Config

- relay domain — e.g. `relay.example.com`
- owner pubkey — optional
- contact info — optional, shown in relay metadata
