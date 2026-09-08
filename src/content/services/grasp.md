---
title: grasp
description: Self-hosted git-over-nostr backend — a git host with an embedded relay and repo explorer.
tagline: Git hosting over Nostr with embedded relay
type: tools
repo: https://gitworkshop.dev/danconwaydev.com/ngit-grasp
nips: []
media: []
order: 7
---

grasp is a git host that speaks Nostr: push and clone over the network, with an embedded relay and a built-in repo explorer.

<!-- TODO: how repos/branches map to events. Screenshot of the explorer. -->

## Config

One domain serves both git traffic and the relay.

- grasp domain — e.g. `git.example.com`
- relay name and description — optional, shown in NIP-11 info
- bootstrap sync relay — optional, seeds repo discovery
- accept contributor PRs — off by default
- repository whitelist and blocked authors — optional access control
