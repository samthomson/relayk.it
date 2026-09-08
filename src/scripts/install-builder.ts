/**
 * Install command builder (on /install): npub + domain inputs (npub readable
 * from a NIP-07 extension) generate the exact one-shot install command,
 * copyable to clipboard.
 */

const CHARSET = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l';

function bech32Polymod(values: number[]): number {
  const GEN = [0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3];
  let chk = 1;
  for (const v of values) {
    const b = chk >> 25;
    chk = ((chk & 0x1ffffff) << 5) ^ v;
    for (let i = 0; i < 5; i++) {
      if ((b >> i) & 1) chk ^= GEN[i];
    }
  }
  return chk;
}

function hrpExpand(hrp: string): number[] {
  return [...hrp].map((c) => c.charCodeAt(0) >> 5).concat([0], [...hrp].map((c) => c.charCodeAt(0) & 31));
}

function convertBits(data: number[], fromBits: number, toBits: number): number[] {
  let acc = 0;
  let bits = 0;
  const ret: number[] = [];
  const maxv = (1 << toBits) - 1;
  for (const value of data) {
    acc = (acc << fromBits) | value;
    bits += fromBits;
    while (bits >= toBits) {
      bits -= toBits;
      ret.push((acc >> bits) & maxv);
    }
  }
  if (bits > 0) ret.push((acc << (toBits - bits)) & maxv);
  return ret;
}

function hexToNpub(hex: string): string {
  const data = convertBits(
    [...hex].map((c) => parseInt(c, 16)),
    4,
    5,
  );
  const values = hrpExpand('npub').concat(data, [0, 0, 0, 0, 0, 0]);
  const polymod = bech32Polymod(values) ^ 1;
  const checksum = [...Array(6)].map((_, i) => (polymod >> (5 * (5 - i))) & 31);
  return 'npub' + '1' + [...data, ...checksum].map((d) => CHARSET[d]).join('');
}

function init(): void {
  const root = document.getElementById('install-builder');
  if (!root) return;

  const npubInput = root.querySelector<HTMLInputElement>('#ib-npub');
  const domainInput = root.querySelector<HTMLInputElement>('#ib-domain');
  const readBtn = root.querySelector<HTMLButtonElement>('#ib-read');
  const output = root.querySelector<HTMLElement>('#ib-command');
  const copyBtn = root.querySelector<HTMLButtonElement>('#ib-copy');
  if (!npubInput || !domainInput || !output || !copyBtn) return;

  const build = () => {
    const npub = npubInput.value.trim();
    const domain = domainInput.value.trim();
    const npubOk = npub.startsWith('npub1') && npub.length > 20;
    const domainOk = /^[a-z0-9.-]+$/.test(domain) && domain.includes('.');
    root.dataset['ready'] = String(npubOk && domainOk);
    // Each field substitutes independently, so reading the npub from the
    // extension updates the command immediately (domain stays a placeholder).
    output.textContent =
      'git clone https://github.com/samthomson/relaykit && cd relaykit &&\n' +
      `OWNER_NPUB='${npubOk ? npub : 'npub1…'}' RELAYKIT_HOST='${domainOk ? domain : 'rkit.example.com'}' ./scripts/install.sh`;
  };

  npubInput.addEventListener('input', build);
  domainInput.addEventListener('input', build);

  if (readBtn) {
    const nostr = (window as Window & { nostr?: { getPublicKey: () => Promise<string> } }).nostr;
    if (!nostr) {
      readBtn.disabled = true;
      readBtn.title = 'No NIP-07 extension detected';
    } else {
      readBtn.addEventListener('click', async () => {
        try {
          readBtn.disabled = true;
          const hex = await nostr.getPublicKey();
          npubInput.value = hex.startsWith('npub') ? hex : hexToNpub(hex);
          build();
        } catch {
          readBtn.title = 'Extension refused';
        } finally {
          readBtn.disabled = false;
        }
      });
    }
  }

  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(output.textContent ?? '');
      copyBtn.textContent = 'Copied ✓';
      setTimeout(() => (copyBtn.textContent = 'Copy'), 1600);
    } catch {
      copyBtn.textContent = 'Copy failed';
      setTimeout(() => (copyBtn.textContent = 'Copy'), 1600);
    }
  });

  build();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
