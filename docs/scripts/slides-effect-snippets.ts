import { createHash } from 'node:crypto';

export function hostedSpriteSnippet(source: string, sprite: (url: string, sha256: string, data: Buffer) => void) {
    return source.replace(/data:image\/png;base64,([A-Za-z0-9+/=]+)/g, (_uri, encoded) => {
        const data = Buffer.from(encoded, 'base64');
        const sha256 = createHash('sha256').update(data).digest('hex');
        const url = `/slides/effects/sprites/${sha256}.png`;
        sprite(url, sha256, data);
        return `https://legend.so${url}`;
    });
}
