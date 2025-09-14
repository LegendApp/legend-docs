import classNames from 'classnames';
import { Header } from './Header';

interface Props {
    items: string[];
    title?: string;
    border?: boolean;
    headerSize?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5';
}

function ListItem({ item }: { item: string }) {
    return (
        <li className="flex items-center space-x-2">
            <div className="w-1 h-4 bg-blue-600 rounded-sm mr-1 sm:mr-2"></div>
            <span>{item}</span>
        </li>
    );
}

export function List({ items, title, border, headerSize }: Props) {
    return (
        <div className={classNames(border && 'border border-tBorder shadow-tShadowDark bg-tBg rounded-lg p-3 sm:p-4')}>
            {title && <Header size={headerSize || 'h6'}>{title}</Header>}
            <ul className="pt-4 text-zinc-400 font-medium space-y-2 list-none pl-0 sm:pl-2">
                {items.map((item) => (
                    <ListItem key={item} item={item} />
                ))}
            </ul>
        </div>
    );
}
