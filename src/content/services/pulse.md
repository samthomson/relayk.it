---
title: pulse
description: Personal push notifications for Nostr events — mentions, replies, zaps and DMs to your phone.
tagline: Push notifications for Nostr events to your phone
type: tools
repo: https://github.com/samthomson/relaykit/tree/master/app/apps/notif-hub
nips: []
media: []
order: 8
---

pulse is a notification hub: it watches your relays and pushes what matters — mentions, replies, zaps, DMs — to your phone. You install it as an app (PWA) from its domain, set your identity, relays and rules inside it, and from then on the notifications arrive like any other app's.

Delivery works two ways:

- **Web push** — the standard route; on iOS this means native-style notifications straight from the installed app
- **The bundled ntfy server** — for de-googled Android: the ntfy app holds its own connection, no Google Play Services involved, works on GrapheneOS

Both channels are part of the deployment — pick per device.

<!-- TODO: screenshot of a push on a phone home screen + rules config. -->

## Config

- pulse domain — e.g. `notifs.example.com`; open on your phone to install
- push domain — e.g. `push.example.com`; for the bundled ntfy server
