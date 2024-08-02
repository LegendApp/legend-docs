import classNames from "classnames";
import { Header } from "./Header";

interface Props {
  items: string[];
  title?: string;
  border?: boolean;
  headerSize?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5';
}

function ListItem({ item }: { item: string }) {
  return (
    <li className="flex items-center space-x-2">
      <div className="w-1 h-4 bg-blue-600 rounded-sm mr-2"></div>
      <span>{item}</span>
    </li>
  );
}

export function List({ items, title, border, headerSize }: Props) {
  return (
    <div
      className={classNames("!mt-0", border && "border border-white/10 rounded-lg p-4")}
    >
      {title && <Header size={headerSize || 'h5'}>{title}</Header>}
      <ul className="text-gray-400 font-medium space-y-2 list-none pl-2">
        {items.map((item) => (
          <ListItem key={item} item={item} />
        ))}
      </ul>
    </div>
  );
}