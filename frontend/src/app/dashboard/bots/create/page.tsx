"use client"
import CreateBotForm from '@/components/bot/CreateBotForm';
import { withAuth } from '@/lib/withAuth';

function CreateBotPage() {
  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <CreateBotForm />
      </div>
    </div>
  );
}

export default withAuth(CreateBotPage);
