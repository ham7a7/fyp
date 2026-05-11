import { Button } from '../ui/Button';

interface IntentPageHeaderProps {
  onCreate: () => void;
}

export default function IntentPageHeader({ onCreate }: IntentPageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/50 backdrop-blur-sm p-6 rounded-3xl border border-gray-100 shadow-sm mb-6">
      <div>
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Bot Intents</h2>
        <p className="text-sm text-gray-500 mt-1 font-medium">
          Train your bot to understand and respond to user queries
        </p>
      </div>
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <Button 
          onClick={onCreate} 
          className="flex-1 sm:flex-none"
        >
          Create New Intent
        </Button>
      </div>
    </div>
  );
}