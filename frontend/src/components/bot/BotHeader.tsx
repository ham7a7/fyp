import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';

interface BotHeaderProps {
  name: string;
  onEdit: () => void;
  onDelete: () => void;
}

export default function BotHeader({ name, onEdit, onDelete }: BotHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/50 backdrop-blur-sm p-6 rounded-3xl border border-gray-100 shadow-sm">
      <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">{name}</h2>
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <Button onClick={onEdit} variant="outline" className="flex-1 sm:flex-none flex items-center gap-2">
          <Pencil className="w-4 h-4" />
          Edit Bot
        </Button>
        <Button 
          onClick={onDelete} 
          className="flex-1 sm:flex-none flex items-center gap-2 bg-red-50! hover:bg-red-100! text-red-700! border-0! shadow-none!"
        >
          <Trash2 className="w-4 h-4" />
          Delete Bot
        </Button>
      </div>
    </div>
  );
}