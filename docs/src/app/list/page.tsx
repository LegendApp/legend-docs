import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/app/layout.config';
import Link from 'next/link';

export default function ListHomePage() {
  return (
    <HomeLayout {...baseOptions}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-4">Legend List</h1>
        <p className="text-lg text-muted-foreground mb-6">
          Hello World - This is the Legend List homepage.
        </p>
        <Link 
          href="/list/docs/v2" 
          className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          View Documentation
        </Link>
      </div>
    </HomeLayout>
  );
}