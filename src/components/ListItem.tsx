import React from 'react';
import { EquipmentItem } from '../types';

interface ListItemProps {
  item: EquipmentItem;
  onEdit: (item: EquipmentItem) => void;
  onDelete?: (id: string) => void;
}

export const ListItem: React.FC<ListItemProps> = ({ item, onEdit, onDelete }) => {
  const isBlocked = item.safetyStatus === 'Blocked (Safety Violation)';

  return (
    <div className={`p-5 rounded-2xl border transition-all shadow-sm hover:shadow-md bg-white ${
      isBlocked ? 'border-red-400 bg-red-50/40' : 'border-[#c3c6d4]/80 hover:border-[#003178]'
    }`}>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Left: Image / Attachment Preview + Details */}
        <div className="flex items-start gap-4 min-w-0 flex-1">
          {/* Thumbnail Preview */}
          <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0 flex items-center justify-center">
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=200&q=80';
                }}
              />
            ) : (
              <span className="material-symbols-outlined text-[32px] text-[#003178]">
                {item.category.includes('Invoice') ? 'receipt_long' : 'medical_services'}
              </span>
            )}
            
            {/* Safety Badge Overlay */}
            <span
              className={`absolute bottom-1 right-1 px-1.5 py-0.5 text-[9px] font-extrabold rounded text-white flex items-center gap-0.5 ${
                isBlocked ? 'bg-red-600' : 'bg-emerald-600'
              }`}
              title={isBlocked ? 'Flagged by Content Guard' : 'Passed Gemini Safety Scan'}
            >
              <span className="material-symbols-outlined text-[10px]">
                {isBlocked ? 'shield_lock' : 'verified_user'}
              </span>
            </span>
          </div>

          {/* Text Content */}
          <div className="min-w-0 flex-1 space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-[15px] font-extrabold text-[#071e27] truncate">
                {item.name}
              </h4>

              {/* Shield Badge */}
              <span className="px-2 py-0.5 bg-[#003178]/10 text-[#003178] border border-[#003178]/20 text-[10px] uppercase font-mono-data font-bold rounded-md flex items-center gap-1 shrink-0">
                <span>🛡️</span> Automated AI Content Moderation Active
              </span>

              {/* Safety Status Pill */}
              <span
                className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full border shrink-0 ${
                  isBlocked
                    ? 'bg-red-100 text-red-800 border-red-300'
                    : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                }`}
              >
                {item.safetyStatus}
              </span>
            </div>

            <p className="text-[12px] text-[#434652] font-semibold line-clamp-1">
              Model: <span className="font-mono-data text-[#003178]">{item.modelNumber}</span> | Serial: <span className="font-mono-data">{item.serialNumber}</span>
              {item.invoiceAmountINR ? ` | Bill Value: ₹${item.invoiceAmountINR.toLocaleString('en-IN')}` : ''}
            </p>

            <p className="text-[12px] text-[#737783] line-clamp-2 leading-relaxed">
              {item.specifications}
            </p>

            {item.moderationReason && (
              <p className={`text-[11px] font-mono-data p-1.5 rounded ${isBlocked ? 'bg-red-100/80 text-red-900 font-bold' : 'bg-gray-100 text-gray-700'}`}>
                Audit note: {item.moderationReason}
              </p>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0 self-end md:self-center w-full md:w-auto justify-end">
          {item.invoiceUrl && (
            <a
              href={item.invoiceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-[#071e27] text-[12px] font-bold rounded-xl transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">receipt</span>
              <span>Invoice</span>
            </a>
          )}

          <button
            type="button"
            onClick={() => onEdit(item)}
            className="px-4 py-2 bg-[#003178] hover:bg-[#002256] text-white text-[12px] font-extrabold rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">edit</span>
            <span>Edit / Scan Specs</span>
          </button>

          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(item.id)}
              className="p-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl border border-red-200 transition-colors flex items-center justify-center cursor-pointer"
              title="Delete uploaded equipment item or invoice"
            >
              <span className="material-symbols-outlined text-[16px]">delete</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
