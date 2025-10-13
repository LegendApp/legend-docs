import { listDocs } from '@/.source';
import { loader } from 'fumadocs-core/source';

export const source = loader({
  baseUrl: '/list',
  source: listDocs.toFumadocsSource(),
});