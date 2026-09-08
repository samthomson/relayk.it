---
title: Self-updating dashboard
description: RelayKit updates itself in place. The navbar shows your running version, checks GHCR anonymously, and one click stages and rolls the new release.
order: 3
---

RelayKit is deployed as a versioned Docker image, and the dashboard can update itself — no SSH required.

## How it works

- The navbar shows the **running version** and a green **update badge** when a newer release exists on GHCR (checked anonymously via the OCI registry API — no auth server involved).
- Clicking **update** pulls the new image, stages its bundled `release.yml` onto the shared data volume, and runs a one-shot helper container (over the Docker socket) that recreates the stack.
- The control plane (RelayKit + Dokploy) restarts for a few seconds; **Traefik and all your hosted services keep running** throughout.
- The dashboard shows an "updating" overlay and reconnects automatically when the new version is up. The update dialog includes release notes and status badges.

Prefer the terminal? On the server:

```bash
IMAGE_TAG=<version> ./scripts/deploy-image.sh
```

See the [changelog](/changelog) for what shipped in each release.
