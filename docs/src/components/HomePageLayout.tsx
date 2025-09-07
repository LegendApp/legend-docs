import { CustomNavbar } from '@/components/navbar';

export function HomePageLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <CustomNavbar />
            {children}
        </>
    );
}
