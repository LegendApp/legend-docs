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
    framework: Blocks,
    diff: FileDiff,
    markdown: FileText,
    music: AudioLines,
    slides: Presentation,
    code: Code2,
    'chat-history': MessageSquare,
    'hello-world': Monitor,
};

export function ProjectIcon({ slug, size = 22 }: { slug: string; size?: number }) {
    const Icon = icons[slug] ?? Blocks;
    return <Icon size={size} strokeWidth={1.6} aria-hidden="true" />;
}
