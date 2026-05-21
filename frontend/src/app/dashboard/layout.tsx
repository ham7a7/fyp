'use client';

import DashboardHeader from '@/components/dashboard/DashboardHeader';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans text-gray-900 selection:bg-blue-200">
      <DashboardHeader />
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}
