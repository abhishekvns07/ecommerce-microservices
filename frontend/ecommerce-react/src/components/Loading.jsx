import React from 'react';
import { Loader2 } from 'lucide-react';

export const Loading = ({ text = 'Loading data from API Gateway...' }) => {
  return (
    <div className="py-20 flex flex-col items-center justify-center text-center">
      <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-3" />
      <p className="text-xs font-mono text-slate-400">{text}</p>
    </div>
  );
};
