import { type Observable } from '@legendapp/state';
import { observer } from '@legendapp/state/react';
import { $React } from '@legendapp/state/react-web';
import { BiMoon, BiSun } from 'react-icons/bi';
export const ThemeButton = observer(function ThemeButton({ $value }: { $value: Observable<'light' | 'dark'> }) {
    const value = $value.get();
    return (
        <$React.div
            className={
                'absolute right-0 top-0 size-8 flex justify-center items-center cursor-pointer hover:text-blue-500'
            }
            onClick={() => $value.set((prev) => (prev === 'dark' ? 'light' : 'dark'))}
        >
            {value === 'dark' ? <BiMoon size={16} /> : <BiSun size={16} />}
        </$React.div>
    );
});
