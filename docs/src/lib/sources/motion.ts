import { motionDocs } from '@/.source';
import { loader } from 'fumadocs-core/source';

export const source = loader({
  baseUrl: '/motion/docs',
  source: motionDocs.toFumadocsSource(),
});