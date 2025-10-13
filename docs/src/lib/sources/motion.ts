import { motionDocs } from '@/.source';
import { loader } from 'fumadocs-core/source';

export const source = loader({
    baseUrl: '/motion',
    source: motionDocs.toFumadocsSource(),
});
