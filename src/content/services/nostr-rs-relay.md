---
title: nostr-rs-relay
description: A Rust Nostr relay with policy controls — pubkey whitelists and kind filtering.
tagline: Rust relay with whitelist and kind filtering
type: relay
repo: https://github.com/scsibug/nostr-rs-relay
nips: [NIP-01, NIP-11, NIP-42]
media: []
order: 2
---

[nostr-rs-relay](https://github.com/scsibug/nostr-rs-relay) is a Nostr relay in Rust. Use it when you want control over who can publish and which event kinds are accepted.

<!-- TODO: screenshot. -->

## Config

- relay domain — e.g. `relay.example.com`
- whitelisted pubkeys — who can publish; empty = no whitelist
- whitelisted / blacklisted event kinds — what's accepted; empty = no filter
- optional NIP-42 auth requirement before writes
