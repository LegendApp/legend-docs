export function getFirstDocsPath(docType: 'list' | 'list1' | 'list2' | 'state' | 'motion' | 'state2'): string {
    if (docType === 'list') {
        return '/list/v3/overview';
    } else if (docType === 'list2') {
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

export function getDocumentationRedirect(pathname: string): string | undefined {
    const redirects: Record<string, Parameters<typeof getFirstDocsPath>[0]> = {
        '/list': 'list', '/list/v3': 'list', '/list/v2': 'list2', '/list/v1': 'list1',
        '/state/v3': 'state', '/state/v2': 'state2', '/motion': 'motion', '/motion/v2': 'motion',
    };
    const target = redirects[pathname.replace(/\/$/, '')];
    return target ? getFirstDocsPath(target) : undefined;
}
