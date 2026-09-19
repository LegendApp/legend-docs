# Curated example sources

These are complete, unmodified source listings from the Legend List commit in
`manifest.json`. The `.txt` suffix keeps the listings out of TypeScript compilation.
The documentation's interactive previews are maintained separately in
`src/components/list/example-web/curated`.

The static build reads these checked-in files and does not need another checkout
or a network fetch. Source links point to the same upstream commit.

To explicitly refresh the snapshot, run from `docs`:

```sh
bun scripts/sync-list-example-sources.ts /path/to/legend-list <commit-or-tag>
```

Review and commit the resulting snapshot with any corresponding preview changes.
The refresh script reads committed Git objects, so it cannot capture local edits.
