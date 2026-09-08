---
title: Troubleshooting
description: When a service won't start, a domain won't resolve, or an update misbehaves — start here.
section: reference
order: 2
---

## A deploy failed but the card looks fine

Status is real, not assumed — but early failures can be subtle. Open the service's **logs** first; a failed build leaves no container, and [insights](/features/insights) will flag it.

## Certificate won't issue

DNS must point directly at the server, un-proxied, for the first issuance. Then edit the service's **domain** and save — RelayKit retries the TLS certificate for you and reconnects the dashboard while the proxy restarts.

## Domain already in use

A domain can only route to one service. Check existing projects for a conflicting route before reusing a hostname.

## Still stuck?

[Open an issue](https://github.com/samthomson/relaykit/issues) — describe what you did, what you expected, and what happened. Bug reports and feature requests both live there.
