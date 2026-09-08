---
title: Hello World
description: A light Nostr client for writing and scheduling posts.
order: 1
---

A light Nostr client, focused only on posting. Included with every install.

Its distinctive feature is **scheduling**: write a post now, have it publish later. This works because RelayKit is always on — the scheduled post is signed by you when you create it, so no keys are ever stored on the server. When the time comes, RelayKit publishes the already-signed event to your relays.

<!-- TODO: screenshots of composing + scheduled queue. -->
