import { ReactNode } from 'react';
import { CustomNavbar } from '@/components/navbar';

export function HomePageLayout({ children, roundedBottom = false }: { children: ReactNode; roundedBottom?: boolean }) {
    return (
        <>
            <CustomNavbar roundedBottom={roundedBottom} />
            {children}
        </>
    );
}
