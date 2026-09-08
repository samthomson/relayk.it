---
title: nPanel
description: An nsite gateway with built-in NIP-05 names on the same domain — host static sites straight from Nostr.
tagline: nsite gateway with same-domain NIP-05 names
type: gateway
repo: https://github.com/hzrd149/nsite-gateway
nips: [NIP-05, NIP-5A]
media: []
order: 6
---

nPanel serves static sites published to Nostr (NIP-5A) and answers NIP-05 names on the same domain. Republish the nsite manifest event from anywhere — changes are picked up automatically within ~10 minutes, or immediately via the service's refresh action.

<!-- TODO: walkthrough — publish a site from a client, watch it appear. Screenshot/video. -->

## Config

- site domain — the suffix RelayKit builds the full NIP-5A host from
- publishing key — the account that signs the site manifests
- site id — optional, for multiple sites under one key
- public hostname — optional, what visitors type (e.g. `relayk.it`)
- NIP-05 users — `name=npub` mappings on the same domain
- manifest relays — optional, defaults are fine
