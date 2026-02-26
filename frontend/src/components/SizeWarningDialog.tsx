import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { AlertTriangle, X } from 'lucide-react';
import { TrialCartItem } from '../contexts/AppContext';

interface SizeWarningDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  recommendedSize: string;
  selectedSize: string;
  pendingItem?: TrialCartItem | null;
}

export default function SizeWarningDialog({
  open,
  onClose,
  onConfirm,
  recommendedSize,
  selectedSize,
}: SizeWarningDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="border-0 p-0 max-w-sm"
        style={{
          background: 'rgba(15, 5, 30, 0.95)',
          backdropFilter: 'blur(30px)',
          border: '1px solid rgba(244, 114, 182, 0.3)',
          boxShadow: '0 0 40px rgba(244, 114, 182, 0.2)',
        }}
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(244, 114, 182, 0.2)', border: '1px solid rgba(244, 114, 182, 0.4)' }}
            >
              <AlertTriangle size={20} className="text-pink-400" />
            </div>
            <DialogTitle className="text-white font-semibold text-base">Size Mismatch Warning</DialogTitle>
          </div>

          <DialogDescription className="text-white/60 text-sm mb-2">
            This size may not fit you.
          </DialogDescription>
          <div
            className="p-3 rounded-xl mb-5"
            style={{ background: 'rgba(244, 114, 182, 0.1)', border: '1px solid rgba(244, 114, 182, 0.2)' }}
          >
            <p className="text-sm text-white/70">
              You selected <span className="text-pink-400 font-bold">{selectedSize}</span>, but your body scan recommends{' '}
              <span className="text-green-400 font-bold">{recommendedSize}</span>.
            </p>
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
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 btn-glow-pink"
              style={{
                background: 'linear-gradient(135deg, rgba(244,114,182,0.3), rgba(192,132,252,0.3))',
                border: '1px solid rgba(244,114,182,0.4)',
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
