/**
 * Build-time Nostr note fetching for the homepage notes wall.
 * Queries relay.relayk.it during `astro build`:
 *   1. the curated seed note IDs (approved in article/notes.txt)
 *   2. any note by the author tagged #relaykit
 * Merged, deduped, newest first. Output is fully static HTML, no client JS.
 * If the relay is unreachable the section renders empty and hides itself.
 */

export interface EmbeddedNote {
  id: string;
  createdAt: number;
  content: string;
  firstImage?: string;
}

const RELAYS = ['wss://relay.relayk.it', 'wss://relay.samt.st'];
const AUTHOR = '2093baa8621c5b255e8f4fc2c6fdfc10d8a5598a25517664efaba860735f1030';

/** Approved seed note IDs (see article/notes.txt for provenance). */
export const NOTE_IDS = [
  '27f8d0f54db85efefeceaaa607796e1e9daaf6c2a063d549f13762cbb7deb4fd',
  '0bb8f9dc876bd619cef92c98fe48558b7518032b564203a8c2d7c04398ee860a',
  '6dfc49c1a9ed6de6cd3de1e560a6252828984a364c5e1ff7f8186bb41e7baf39',
  '8092c1926ecaed78b5c1eb8aaf8ff5fbb5f5a430c9377302725d9c9afe5f1541',
  'bfd70b4fa59d609b2fadad27531ca5c7f3d56ec164119b9845dc3fb2d721f134',
  'ea2ece0560e8f7eb2273ec82a86c8c22c9642b30a121e140935df1c4934fbc00',
  '2f027aac7a165e4db60cc15b5098488a04307a2dbc514da9c50c6f72fef076b9',
  '48d102bd3b828f01d2bbcead0f26aea6ea8846ab0f067e4edaf6372b9332ef35',
  '74d26268eecb063e7c710ccbb1286000af4b4a57fe209e8c42622f0b24c843eb',
  'cf8cbd85bdcfe3c1e97efa1f22626743ccbcd3d45c9a1fd9d7036bf737dc9fc2',
  '5a5ff752aeba1512fad47d0af3c345063c156b1a8793d41d6b00bdc85349cec7',
];

const isReply = (e: { tags: string[][] }): boolean =>
  e.tags.some(([t]) => t === 'e');

const FILTERS = [
  { ids: NOTE_IDS },
  { kinds: [1], authors: [AUTHOR], '#t': ['relaykit'], limit: 50 },
];

const fetchOne = (url: string): Promise<EmbeddedNote[]> =>
  new Promise((resolve) => {
    const out: EmbeddedNote[] = [];
    let ws: WebSocket;
    try {
      ws = new WebSocket(url);
    } catch {
      resolve([]);
      return;
    }
    let settled = false;
    const done = () => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      try {
        ws.close();
      } catch {
        // already closed
      }
      resolve(out);
    };
    const timer = setTimeout(done, 10000);
    ws.onopen = () => ws.send(JSON.stringify(['REQ', 'embed', ...FILTERS]));
    ws.onmessage = (ev) => {
      try {
        const m = JSON.parse(String(ev.data)) as {
          0: string;
          2?: { id: string; created_at: number; content: string; tags: string[][] };
        };
        if (m[0] === 'EVENT' && m[2]) {
          const e = m[2];
          if (isReply(e)) return; // root notes only
          const imgs = [...e.content.matchAll(/https?:\/\/\S+\.(png|jpe?g|gif|webp)/gi)].map((x) => x[0]);
          out.push({ id: e.id, createdAt: e.created_at, content: e.content, firstImage: imgs[0] });
        } else if (m[0] === 'EOSE') {
          done();
        }
      } catch {
        // malformed frame — skip
      }
    };
    ws.onerror = done;
    ws.onclose = done;
  });

export async function fetchNotes(): Promise<EmbeddedNote[]> {
  const results = await Promise.all(RELAYS.map(fetchOne));
  const merged = new Map<string, EmbeddedNote>();
  for (const list of results) for (const n of list) merged.set(n.id, n);
  return [...merged.values()].sort((a, b) => b.createdAt - a.createdAt);
}
