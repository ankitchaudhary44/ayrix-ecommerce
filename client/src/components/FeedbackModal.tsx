'use client';

import React, { useState } from 'react';
import { X, ThumbsUp, RotateCcw, Shirt } from 'lucide-react';
import { api } from '@/lib/api';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  purchase: any;
  onSuccess: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  purchase,
  onSuccess
}) => {
  const [status, setStatus] = useState<'kept' | 'returned'>('kept');
  const [returnReason, setReturnReason] = useState<string>('too_small');
  const [comments, setComments] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !purchase) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await api.post('/feedback', {
        purchaseId: purchase._id,
        status,
        returnReason: status === 'returned' ? returnReason : undefined,
        comments
      });
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 font-sans backdrop-blur-sm">
      <div className="bg-white rounded max-w-lg w-full overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-zinc-200 flex items-center justify-between bg-zinc-50">
          <div className="flex items-center gap-3">
            <div className="bg-rose-100 p-2 rounded-full">
              <Shirt className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-900 tracking-tight">
                Fit & Size Feedback
              </h3>
              <p className="text-xs text-zinc-500 font-medium mt-0.5">
                Help us improve sizing recommendations
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-700 bg-zinc-200/50 hover:bg-zinc-200 p-2 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">
            
            {/* Product Summary */}
            <div className="bg-zinc-50 p-3 rounded border border-zinc-100 flex items-center justify-between">
              <div>
                <p className="text-[13px] font-bold text-zinc-900">{purchase.productId?.brand}</p>
                <p className="text-[11px] text-zinc-500 line-clamp-1">{purchase.productId?.name}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-zinc-400 uppercase font-bold block">Size</span>
                <span className="text-sm font-bold text-zinc-900">{purchase.sizePurchased}</span>
              </div>
            </div>

            {/* Status Selection */}
            <div>
              <label className="text-[11px] font-bold text-zinc-800 uppercase tracking-widest block mb-3">
                Did this item fit you well?
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setStatus('kept')}
                  className={`py-3 px-4 rounded border text-[13px] font-bold flex items-center justify-center gap-2 transition-all ${
                    status === 'kept'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm'
                      : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                  }`}
                >
                  <ThumbsUp className="w-4 h-4" />
                  Kept It
                </button>

                <button
                  type="button"
                  onClick={() => setStatus('returned')}
                  className={`py-3 px-4 rounded border text-[13px] font-bold flex items-center justify-center gap-2 transition-all ${
                    status === 'returned'
                      ? 'bg-rose-50 border-rose-500 text-rose-700 shadow-sm'
                      : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                  }`}
                >
                  <RotateCcw className="w-4 h-4" />
                  Returned It
                </button>
              </div>
            </div>

            {/* Return Reason */}
            {status === 'returned' && (
              <div className="animate-in slide-in-from-top-2 duration-300">
                <label className="text-[11px] font-bold text-zinc-800 uppercase tracking-widest block mb-2">
                  What was the primary fit issue?
                </label>
                <select
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  className="w-full bg-white border border-zinc-300 text-zinc-900 rounded px-3 py-2.5 text-[13px] focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                >
                  <option value="too_small">Overall too small</option>
                  <option value="too_large">Overall too large</option>
                  <option value="tight_chest">Too tight around the chest</option>
                  <option value="loose_shoulder">Too loose around the shoulders</option>
                  <option value="too_long">Garment was too long</option>
                  <option value="too_short">Garment was too short</option>
                  <option value="uncomfortable_fabric">Fabric felt uncomfortable or stiff</option>
                  <option value="different_fit">Fit didn't match the description</option>
                  <option value="other">Other issue</option>
                </select>
              </div>
            )}

            {/* Comments */}
            <div>
              <label className="text-[11px] font-bold text-zinc-800 uppercase tracking-widest block mb-2">
                Additional Comments (Optional)
              </label>
              <textarea
                rows={3}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="e.g. The sleeves were a bit tight, but the length was perfect."
                className="w-full bg-white border border-zinc-300 text-zinc-900 placeholder-zinc-400 rounded p-3 text-[13px] focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 resize-none"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-zinc-50 border-t border-zinc-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-[13px] font-bold text-zinc-600 hover:text-zinc-900 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-rose-500 hover:bg-rose-600 text-white font-bold text-[13px] uppercase tracking-wider px-6 py-2.5 rounded transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center min-w-[160px]"
            >
              {submitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
