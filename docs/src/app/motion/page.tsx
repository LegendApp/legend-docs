import { getFirstDocsPath } from '@/lib/getDocsPath';
import { redirect } from 'next/navigation';

export default function MotionPage() {
    redirect(getFirstDocsPath('motion'));
}
