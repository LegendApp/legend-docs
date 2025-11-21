export function getFirstDocsPath(docType: 'list' | 'list1' | 'state' | 'motion' | 'state2'): string {
    if (docType === 'list') {
        return '/list/v2/getting-started';
    } else if (docType === 'list1') {
        return '/list/v1/getting-started';
    } else if (docType === 'state') {
        return '/state/v3/intro/introduction';
    } else if (docType === 'state2') {
        return '/state/v2/intro/introduction';
    } else if (docType === 'motion') {
        return '/motion/v2/getting-started/introduction';
    }
    return '/';
}
