import { listDocs } from '@/.source';
import { loader } from 'fumadocs-core/source';

export const source = loader({
  baseUrl: '/list/docs',
  source: listDocs.toFumadocsSource(),
});