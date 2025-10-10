import { redirect } from 'next/navigation';

export default function ListPage() {
    redirect('/list/v2');

    // return (
    //     <HomePageLayout>
    //         <ListHomePage />
    //     </HomePageLayout>
    // );
}
