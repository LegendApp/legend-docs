'use client';

import { create } from '@orama/orama';
import { useDocsSearch } from 'fumadocs-core/search/client';
import {
    SearchDialog,
    SearchDialogClose,
    SearchDialogContent,
    SearchDialogHeader,
    SearchDialogIcon,
    SearchDialogInput,
    SearchDialogList,
    SearchDialogOverlay,
    type SharedProps,
} from 'fumadocs-ui/components/dialog/search';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function initOrama(): any {
    return create({
        schema: { _: 'string' },
        language: 'english',
    });
}

export default function StaticSearchDialog(props: SharedProps) {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
    const searchEndpoint = `${basePath}/api/search`;

    const { search, setSearch, query } = useDocsSearch({
        type: 'static',
        initOrama,
        from: searchEndpoint,
    });

    return (
        <SearchDialog search={search} onSearchChange={setSearch} isLoading={query.isLoading} {...props}>
            <SearchDialogOverlay />
            <SearchDialogContent>
                <SearchDialogHeader>
                    <SearchDialogIcon />
                    <SearchDialogInput />
                    <SearchDialogClose />
                </SearchDialogHeader>
                <SearchDialogList items={query.data !== 'empty' ? query.data : null} />
            </SearchDialogContent>
        </SearchDialog>
    );
}
