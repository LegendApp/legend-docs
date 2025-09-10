import { redirect } from 'next/navigation';

export default function MotionPage() {
    // Redirect to the first available motion doc or v1 index
    redirect('/motion/v1');
}
