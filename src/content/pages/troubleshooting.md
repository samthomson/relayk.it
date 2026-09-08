---
title: Troubleshooting
description: When a service won't start, a domain won't resolve, or an update misbehaves — start here.
section: reference
order: 2
---

## A deploy failed but the card looks fine

Status is real, not assumed — but early failures can be subtle. Open the service's **logs** first; a failed compose build leaves no container, and [insights](/features/insights) will flag it.

## Certificate won't issue

Let's Encrypt needs ports 80/443 open and DNS pointing directly at the server — **not proxied through Cloudflare** — during first issuance. Check the Traefik logs, and confirm the cert resolver is `letsencrypt` in `/etc/dokploy/traefik/traefik.yml`.

## Setup script says "Registration failed"

Dokploy already has an admin. Create an API key manually (Dokploy → Settings → Profile → API/CLI) and write it in:

```bash
docker compose exec relaykit sh -c 'printf "%s" "PASTE_THE_KEY_HERE" > /app/.relaykit/bootstrap-key'
```

## Domain already in use

A domain can only route to one service. Check existing projects for a conflicting route before reusing a hostname.


## The setup script says "Registration failed"

This only happens on re-runs where Dokploy already has an admin account (a fresh
install registers one automatically — if that ever fails on a clean server, that's a bug worth
reporting). To recover: log in to Dokploy directly → Settings → Profile → API/CLI, create an API key,
then write it where RelayKit expects it:

```bash
docker compose exec relaykit sh -c 'printf "%s" "PASTE_THE_KEY_HERE" > /app/.relaykit/bootstrap-key'
```

<!-- TODO: grow this from real support questions as they come in. -->
