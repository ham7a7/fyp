
interface LoadingStateProps {
  message?: string;
  className?: string;
}

export default function LoadingState({
  message = 'Loading...',
  className = '',
}: LoadingStateProps) {
  return (
    <div className={`flex items-center justify-center p-12 min-h-[50vh] ${className}`}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <div className="text-gray-500 font-medium">{message}</div>
      </div>
    </div>
  );
}
