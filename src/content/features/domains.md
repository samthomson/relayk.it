---
title: Domains & SSL
description: Link any RelayKit service to a domain you own. Routing and certificates are handled automatically.
order: 1
---

Connect your own domain to any service. RelayKit handles routing and certificates: TLS is automatic everywhere — Let's Encrypt in production, local certificates in development.

## Setting a domain

A service's config asks for its domain (e.g. `relay.example.com`). Point DNS at your server.

## Changing it later

Edit the domain on a service and save. Routing updates and the certificate is retried. [pulse](/services/pulse) uses a second domain for its push channel.
