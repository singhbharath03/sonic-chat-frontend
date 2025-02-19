'use client';

import Providers from '@/services/providers';

export default function Template({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Providers>{children}</Providers>;
} 