import { getFirstDocsPath } from '@/lib/getDocsPath';
import { redirect } from 'next/navigation';

export default function ListPage() {
    redirect(getFirstDocsPath('list'));

    // return (
    //     <HomePageLayout>
    //         <ListHomePage />
    //     </HomePageLayout>
    // );
}
