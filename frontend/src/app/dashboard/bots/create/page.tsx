"use client"
import CreateBotForm from '@/components/bot/CreateBotForm';
import { withAuth } from '@/lib/withAuth';

function CreateBotPage() {
  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CreateBotForm />
      </div>
    </div>
  );
}

export default withAuth(CreateBotPage);
