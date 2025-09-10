import { HomePageLayout } from '@/components/HomePageLayout';
import ListHomePage from '@/components/list/home/Home';
import { redirect } from 'next/navigation';

export default function ListPage() {
    redirect('/list/v2');

    // return (
    //     <HomePageLayout>
    //         <ListHomePage />
    //     </HomePageLayout>
    // );
}
