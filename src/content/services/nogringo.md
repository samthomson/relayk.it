---
title: nogringo relay
description: A NIP-17/59 relay with auth-gated gift-wrap reads — reads require AUTH, so only conversation parties can fetch messages.
tagline: Private NIP-17/59 relay with auth-gated reads
type: relay
repo: https://github.com/nogringo/nostr-relay
nips: [NIP-17, NIP-42, NIP-59]
media: []
order: 4
---

The nogringo relay is built for private messaging: it carries NIP-17/59 conversations and gates gift-wrap reads (`kind:1059`) behind NIP-42 AUTH — a client can only fetch the wraps it is a party to.

<!-- TODO: privacy model, client discovery. Screenshot. -->

