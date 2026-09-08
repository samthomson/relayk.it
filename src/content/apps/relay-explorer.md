---
title: Relay explorer
description: Inspect events on any Nostr relay.
order: 2
---

Think **phpMyAdmin for relays**: point it at any Nostr relay and inspect what's on it — events by kind, author and recency.

It's the debugging tool for relays. A filter rejecting events? Whitelist blocking a pubkey? Deployment not accepting writes? Point the explorer at the relay and see exactly what is and isn't there.

Built on plain Nostr — REQ filters over websocket — so it works with any relay, including ones that gate access behind NIP-42 auth.

<!-- TODO: screenshot. -->
