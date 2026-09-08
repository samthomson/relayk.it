---
title: Introduction
description: 'RelayKit is a self-hosted control panel for Nostr infrastructure; deploy host and run: relays, Blossom servers, nsite gateways etc. from one dashboard on your own server.'
section: start
order: 1
---

## What is RelayKit?

RelayKit is a hub for deploying hosting and running Nostr services - relays, Blossom servers, nsite gateways, git hosting, notifications - on your own server, using [Dokploy](https://dokploy.com) under the hood.

You install RelayKit once, then use it to spin up and manage as many Nostr services as you like. It takes care of the tech (eg docker containers, port mappings, ssl, data, etc) - you control everything via a simple UI.

The goal of RelayKit is to empower more people (and organisetions) to run their own nostr services. It does this by reducing the technical barrier to entry, so that more people can take ownership of their nostr experience and increase their sovereignty.

## Who it's for

- **Self-hosters** — run your own relay, Blossom server or nsite gateway without hand-rolling Docker Compose, reverse proxies and certificates.
- **Developers** — spin up disposable Nostr test infrastructure in seconds. Create as many services, organised in groups, as you you need. Run on your local machine, or on a remote server.

Link any service to a **domain you already own** — you buy domains wherever you like, RelayKit just wires
them up: routing, and SSL handled automatically (Let's Encrypt in production, caddy for local dev).
See [Domains & SSL](/features/domains).

## What you can deploy

Every service in RelayKit is a curated preset: a Docker Compose template with sensible defaults, exposed configuration, and automatic domain routing. See the [services overview](/services) for the full list — currently relays ([strfry](/services/strfry), [nostr-rs-relay](/services/nostr-rs-relay), [chapar](/services/chapar)), [Blossom](/services/blossom) media servers, [nPanel](/services/npanel) nsite gateways, [grasp](/services/grasp) git hosting, and [pulse](/services/pulse) notifications.

## How it works

1. Run the install script on any VPS — passing in your npub as a param
2. Sign in with your Nostr identity via a NIP-07 browser extension (Alby, nos2x, …). One owner key, no passwords.
3. Deploy services from the dashboard: pick a preset, connect a domain, done. SSL is handled automatically.


## Where to go next

- [Install RelayKit](/install) on a VPS (or locally for development)
- Follow through to [deploying your first service](/install#deploy-your-first-service)
- Browse the [services](/services) and [features](/features/domains)
