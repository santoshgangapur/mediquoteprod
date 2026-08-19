import React from 'react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  itemName?: string;
  itemType?: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  title = 'Confirm Deletion',
  message,
  itemName,
  itemType = 'Item',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  isDestructive = true,
  onConfirm,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div
        className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-red-100 animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Header Icon & Title */}
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 border border-rose-200">
            <span className="material-symbols-outlined text-[26px]">delete_forever</span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="text-[18px] font-bold text-[#071e27]">{title}</h3>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-700 cursor-pointer p-1 rounded-lg hover:bg-gray-100"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            {itemType && (
              <span className="inline-block px-2 py-0.5 bg-rose-50 text-rose-800 text-[10px] font-bold rounded uppercase tracking-wider mt-0.5">
                {itemType} Action
              </span>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="space-y-2 py-1">
          {itemName && (
            <div className="p-3 bg-[#f8fafc] rounded-xl border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Selected for removal:
              </span>
              <p className="text-[14px] font-bold text-[#003178] truncate mt-0.5">
                {itemName}
              </p>
            </div>
          )}

          <p className="text-[13px] text-[#434652] leading-relaxed whitespace-pre-line">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-[13px] transition-colors cursor-pointer"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-5 py-2.5 rounded-xl font-bold text-[13px] transition-all shadow-sm flex items-center gap-1.5 cursor-pointer text-white ${
              isDestructive
                ? 'bg-rose-600 hover:bg-rose-700 active:bg-rose-800 shadow-rose-200'
                : 'bg-[#003178] hover:bg-[#0d47a1]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">delete</span>
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
