import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Shirt } from 'lucide-react';

interface WardrobeWarningDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}

export default function WardrobeWarningDialog({
  open,
  onClose,
  onConfirm,
  message,
}: WardrobeWarningDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="border-0 p-0 max-w-sm"
        style={{
          background: 'rgba(15, 5, 30, 0.95)',
          backdropFilter: 'blur(30px)',
          border: '1px solid rgba(96, 165, 250, 0.3)',
          boxShadow: '0 0 40px rgba(96, 165, 250, 0.2)',
        }}
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(96, 165, 250, 0.2)', border: '1px solid rgba(96, 165, 250, 0.4)' }}
            >
              <Shirt size={20} className="text-blue-400" />
            </div>
            <DialogTitle className="text-white font-semibold text-base">Wardrobe Insight</DialogTitle>
          </div>

          <DialogDescription className="text-white/60 text-sm mb-2">
            Your AI wardrobe assistant detected:
          </DialogDescription>
          <div
            className="p-3 rounded-xl mb-5"
            style={{ background: 'rgba(96, 165, 250, 0.1)', border: '1px solid rgba(96, 165, 250, 0.2)' }}
          >
            <p className="text-sm text-white/80">{message}</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white/60 transition-all duration-200 hover:text-white"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 btn-glow-blue"
              style={{
                background: 'linear-gradient(135deg, rgba(96,165,250,0.3), rgba(192,132,252,0.3))',
                border: '1px solid rgba(96,165,250,0.4)',
              }}
            >
              Add Anyway
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
