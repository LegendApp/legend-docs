export function getFirstDocsPath(docType: 'list' | 'state' | 'motion'): string {
    if (docType === 'list') {
        return '/list/docs/v2/getting-started';
    } else if (docType === 'state') {
        return '/state/docs/v3';
    } else if (docType === 'motion') {
        return '/motion/docs/v1';
    }
    return '/';
}
