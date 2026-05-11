import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';

interface IntentDetailHeaderProps {
  name: string;
  isFulfillment: boolean;
  intentId: string;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
  deleting: boolean;
}

export default function IntentDetailHeader({ 
  name, 
  isFulfillment, 
  intentId, 
  onBack, 
  onEdit, 
  onDelete, 
  deleting 
}: IntentDetailHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/50 backdrop-blur-sm p-6 rounded-3xl border border-gray-100 shadow-sm">
      <div>
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">{name}</h2>
        <div className="flex gap-2 mt-3 flex-wrap">
          {isFulfillment && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-50 text-purple-700 text-xs font-bold rounded-full border border-purple-100 shadow-sm">
              🔗 Webhook Enabled
            </span>
          )}
          <span className="inline-block px-3 py-1 bg-white text-gray-600 text-xs font-bold rounded-full border border-gray-100 shadow-sm font-mono">
            ID: {intentId}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
        <Button 
          onClick={onBack} 
          variant="outline" 
          className="flex-1 md:flex-none border-gray-200"
        >
          Back
        </Button>
        <Button 
          onClick={onEdit} 
          variant="outline" 
          className="flex-1 md:flex-none flex items-center gap-2"
        >
          <Pencil className="w-4 h-4" />
          Edit
        </Button>
        <Button 
          onClick={onDelete} 
          disabled={deleting}
          className="flex-1 md:flex-none flex items-center gap-2 bg-red-50! hover:bg-red-100! text-red-700! border-0! shadow-none!"
        >
          <Trash2 className="w-4 h-4" />
          {deleting ? 'Deleting...' : 'Delete'}
        </Button>
      </div>
    </div>
  );
}