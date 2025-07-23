'use client';

import { useRouter } from 'next/navigation';
import { AuthorForm } from '@/components/forms/author-form';

export default function NewAuthorPage() {
  const router = useRouter();

  const handleCancel = () => {
    router.push('/authors');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <AuthorForm onCancel={handleCancel} />
    </div>
  );
}