'use client';

import { useRouter } from 'next/navigation';
import { BookForm } from '@/components/forms/book-form';

export default function NewBookPage() {
  const router = useRouter();

  const handleCancel = () => {
    router.push('/books');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BookForm onCancel={handleCancel} />
    </div>
  );
}