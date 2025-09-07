import { ReactNode } from 'react';
import { CustomNavbar } from '@/components/navbar';

export function HomePageLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <CustomNavbar />
            {children}
        </>
    );
}
