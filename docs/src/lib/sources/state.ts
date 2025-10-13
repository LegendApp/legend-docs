import { stateDocs } from '@/.source';
import { loader } from 'fumadocs-core/source';

export const source = loader({
  baseUrl: '/state',
  source: stateDocs.toFumadocsSource(),
});