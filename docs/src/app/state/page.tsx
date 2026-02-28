import { HomePageLayout } from '@/components/HomePageLayout';
import Home from '@/components/state/home/Home';

export default function StateHomePage() {
    return (
        <HomePageLayout roundedBottom>
            <Home />
        </HomePageLayout>
    );
}
