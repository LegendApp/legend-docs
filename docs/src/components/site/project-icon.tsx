import {
    AudioLines,
    Blocks,
    Code2,
    FileDiff,
    FileText,
    List,
    MessageSquare,
    Monitor,
    Presentation,
    Radio,
    Sparkles,
    type LucideIcon,
} from 'lucide-react';

const icons: Record<string, LucideIcon> = {
    list: List,
    state: Radio,
    motion: Sparkles,
    spark: Blocks,
    diff: FileDiff,
    markdown: FileText,
    music: AudioLines,
    slides: Presentation,
    code: Code2,
    'chat-history': MessageSquare,
    'hello-world': Monitor,
};

export function ProjectIcon({ slug, size = 22 }: { slug: string; size?: number }) {
    if (slug === 'spark') return <img src="/assets/legend-spark.png" alt="" width={size} height={size} aria-hidden="true" />;
    const Icon = icons[slug] ?? Blocks;
    return <Icon size={size} strokeWidth={1.6} aria-hidden="true" />;
}
