---
title: Blossom
description: A media server for Nostr — images, video and files.
tagline: Media server for images, video and files
type: media
repo: https://github.com/hzrd149/blossom
nips: [NIP-96, NIP-98]
media: []
order: 5
---

[Blossom](https://github.com/hzrd149/blossom) is a media server: the standard way Nostr apps upload and serve images, video and other files. Run your own and your media is yours.

<!-- TODO: screenshot of an upload. -->

## Config

- blossom domain — e.g. `media.example.com`
- dashboard username and password — admin access; username defaults to `admin`
- allowed pubkeys — who can upload; empty = any authenticated user
