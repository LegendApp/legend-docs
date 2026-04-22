import { LegendList } from "@legendapp/list/react";
import { buildDirectoryPeople, buildSectionedDirectoryRows, type SectionedDirectoryRow } from '../../examples-shared/directory';
import { CARD_CLASS, cardStyle, listViewportStyle, Shell } from "./shared";

const sectionedDirectory = buildSectionedDirectoryRows(buildDirectoryPeople());

export function SectionedDirectoryExample({ showTitle = true }: { showTitle?: boolean } = {}) {
    return (
        <Shell showTitle={showTitle} title="Sectioned Directory">
            <LegendList
                data={sectionedDirectory.rows}
                estimatedItemSize={62}
                keyExtractor={(item) => item.id}
                renderItem={({ item }: { item: SectionedDirectoryRow }) =>
                    item.type === "header" ? (
                        <div
                            className="mb-2 px-3 py-[10px] font-extrabold text-zinc-100"
                            style={{
                                ...cardStyle("#27272a"),
                                border: "1px solid rgba(113, 113, 122, 0.45)",
                                borderRadius: 0,
                            }}
                        >
                            {item.title}
                        </div>
                    ) : (
                        <div className={`${CARD_CLASS} flex items-center gap-3`} style={cardStyle()}>
                            <div
                                className="flex size-[42px] items-center justify-center rounded-full text-white font-extrabold"
                                style={{
                                    background: item.accent,
                                }}
                            >
                                {item.initials}
                            </div>
                            <div>
                                <div className="font-extrabold">{item.name}</div>
                                <div className="text-zinc-400">
                                    {item.title} · {item.city}
                                </div>
                            </div>
                        </div>
                    )
                }
                stickyHeaderIndices={sectionedDirectory.stickyHeaderIndices}
                style={listViewportStyle}
            />
        </Shell>
    );
}
