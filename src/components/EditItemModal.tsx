import React, { useState, useRef, useEffect } from 'react';
import { EquipmentItem } from '../types';

interface EditItemModalProps {
  isOpen: boolean;
  itemToEdit?: EquipmentItem | null;
  onClose: () => void;
  onSave: (item: EquipmentItem) => void;
  onDelete?: (id: string) => void;
}

export const EditItemModal: React.FC<EditItemModalProps> = ({
  isOpen,
  itemToEdit,
  onClose,
  onSave,
  onDelete,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const [name, setName] = useState(itemToEdit?.name || '');
  const [modelNumber, setModelNumber] = useState(itemToEdit?.modelNumber || '');
  const [serialNumber, setSerialNumber] = useState(itemToEdit?.serialNumber || '');
  const [category, setCategory] = useState(itemToEdit?.category || 'Surgical Equipment');
  const [imageUrl, setImageUrl] = useState(itemToEdit?.imageUrl || '');
  const [invoiceUrl, setInvoiceUrl] = useState(itemToEdit?.invoiceUrl || '');
  const [invoiceAmountINR, setInvoiceAmountINR] = useState<number>(itemToEdit?.invoiceAmountINR || 150000);
  const [specifications, setSpecifications] = useState(itemToEdit?.specifications || '');
  const [calibrationStatus, setCalibrationStatus] = useState<'Calibrated' | 'Pending Calibration' | 'Maintenance Required'>(
    itemToEdit?.calibrationStatus || 'Calibrated'
  );
  const [safetyStatus, setSafetyStatus] = useState<'Verified Safe' | 'Pending Safety Moderation' | 'Blocked (Safety Violation)'>(
    itemToEdit?.safetyStatus || 'Verified Safe'
  );
  const [moderationReason, setModerationReason] = useState(itemToEdit?.moderationReason || '');

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedInvoiceFile, setSelectedInvoiceFile] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const errorRef = useRef<HTMLDivElement | null>(null);
  const imageFileInputRef = useRef<HTMLInputElement | null>(null);
  const invoiceFileInputRef = useRef<HTMLInputElement | null>(null);

  // Moderate Image (File or URL)
  const scanAndValidateImage = async (
    file?: File | null,
    urlInput?: string
  ): Promise<boolean> => {
    setIsScanning(true);
    setUploadError(null);

    try {
      let payload: any = {};
      if (file) {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        payload = { imageBase64: base64, mimeType: file.type, fileName: file.name };
      } else if (urlInput && urlInput.trim().length > 0) {
        payload = { imageUrl: urlInput.trim(), fileName: urlInput.trim() };
      } else {
        setIsScanning(false);
        return true;
      }

      const res = await fetch('/api/moderate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setIsScanning(false);

      if (!data.isSafe) {
        const errorMsg =
          data.reason ||
          `⚠️ Upload Prevented: 18+ explicit or disturbing content detected (${data.flagCategory || 'Policy Violation'}).`;
        setUploadError(errorMsg);
        setSafetyStatus('Blocked (Safety Violation)');
        setModerationReason(errorMsg);

        // Bring cursor and focus directly to error message
        setTimeout(() => {
          if (errorRef.current) {
            errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            errorRef.current.focus();
          }
        }, 50);

        return false;
      }

      setSafetyStatus('Verified Safe');
      setModerationReason(data.reason || 'Verified Safe by Gemini Vision AI Content Safety Guard');
      return true;
    } catch (err: any) {
      setIsScanning(false);
      console.error('Error during image moderation:', err);
      return true;
    }
  };

  // Real-time Local File Selection Handler
  const handleLocalFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);

      // Create preview data URL
      const previewUrl = URL.createObjectURL(file);
      setImageUrl(previewUrl);

      // Trigger Real-time AI Content Moderation
      const isOk = await scanAndValidateImage(file, undefined);
      if (!isOk) {
        if (imageFileInputRef.current) imageFileInputRef.current.value = '';
      }
    }
  };

  // Real-time Invoice Attachment Selection Handler
  const handleInvoiceFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedInvoiceFile(file);
      setInvoiceUrl(file.name);

      // Trigger Real-time AI Content Moderation for Invoice attachment
      const isOk = await scanAndValidateImage(file, undefined);
      if (!isOk) {
        if (invoiceFileInputRef.current) invoiceFileInputRef.current.value = '';
      }
    }
  };

  // Real-time URL Input Change Handler
  const handleUrlInputChange = async (val: string) => {
    setImageUrl(val);
    if (val.trim().length > 8 && (val.startsWith('http://') || val.startsWith('https://') || val.startsWith('data:'))) {
      await scanAndValidateImage(null, val);
    }
  };

  // Auto-Extract Specs using AI Vision Endpoint (/api/ai-vision-extract)
  const handleAutoExtractSpecs = async () => {
    if (!imageUrl && !selectedFile) {
      setUploadError('Please select an image file or enter an image URL first.');
      return;
    }

    setIsScanning(true);
    setUploadError(null);

    try {
      let payload: any = {};
      if (selectedFile) {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(selectedFile);
        });
        payload = { imageBase64: base64, mimeType: selectedFile.type, fileName: selectedFile.name };
      } else if (imageUrl) {
        payload = { imageUrl: imageUrl.trim(), fileName: imageUrl.trim() };
      }

      const res = await fetch('/api/ai-vision-extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setIsScanning(false);

      if (res.status === 400 || data.isSafe === false) {
        const errorMsg = data.reason || data.error || 'Upload blocked due to non-compliant or unsafe imagery.';
        setUploadError(errorMsg);
        setSafetyStatus('Blocked (Safety Violation)');
        setModerationReason(errorMsg);

        // Bring cursor to error message
        setTimeout(() => {
          if (errorRef.current) {
            errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            errorRef.current.focus();
          }
        }, 50);
        return;
      }

      if (data.extractedSpecs) {
        const specs = data.extractedSpecs;
        if (specs.equipmentName) setName(specs.equipmentName);
        if (specs.modelNumber) setModelNumber(specs.modelNumber);
        if (specs.serialNumber) setSerialNumber(specs.serialNumber);
        if (specs.specifications) setSpecifications(specs.specifications);
        if (specs.calibrationStatus) setCalibrationStatus(specs.calibrationStatus);
        if (specs.invoiceAmountINR) setInvoiceAmountINR(specs.invoiceAmountINR);

        setSafetyStatus('Verified Safe');
        setModerationReason('Gemini Vision AI Safety Scan Passed & Specifications Auto-Filled.');
      }
    } catch (err: any) {
      setIsScanning(false);
      console.error('Vision extraction failed:', err);
    }
  };

  // Form Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (safetyStatus === 'Blocked (Safety Violation)') {
      setUploadError('Cannot save item: Image is blocked due to 18+ explicit or safety policy violation.');
      if (errorRef.current) {
        errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        errorRef.current.focus();
      }
      return;
    }

    const newItem: EquipmentItem = {
      id: itemToEdit?.id || `eq-${Date.now()}`,
      name: name || 'Medical Device',
      modelNumber: modelNumber || 'MOD-2026',
      serialNumber: serialNumber || 'SN-UNKNOWN',
      category: category || 'Surgical Equipment',
      imageUrl,
      invoiceUrl,
      invoiceAmountINR: Number(invoiceAmountINR) || 0,
      specifications: specifications || 'No specifications provided.',
      calibrationStatus,
      safetyStatus,
      lastScannedDate: new Date().toLocaleDateString('en-GB'),
      moderationReason,
    };

    onSave(newItem);
    onClose();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl border-2 border-[#003178]/30 max-w-2xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8 cursor-default"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#003178] to-[#001d4a] text-white p-6 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[24px] text-sky-300">verified_user</span>
              <h3 className="text-[18px] font-extrabold tracking-tight">
                {itemToEdit ? 'Edit Equipment & Invoice Record' : 'Add New Equipment / Invoice Record'}
              </h3>
            </div>
            {/* Prominent Shield Badge */}
            <div className="flex items-center gap-2 pt-1">
              <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-200 border border-emerald-400/40 text-[11px] font-bold rounded-full flex items-center gap-1">
                <span>🛡️</span> Automated AI Content Moderation Active
              </span>
              <span className="text-[11px] text-sky-200 font-mono-data">Gemini 3.6 Vision Guard</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* HIGH PRIORITY SAFETY ALERT WARNING CARD (FOR BLOCKED UPLOADS) */}
          {uploadError && (
            <div
              ref={errorRef}
              tabIndex={-1}
              className="p-5 bg-red-50 border-2 border-red-500 rounded-2xl shadow-xl focus:outline-none focus:ring-4 focus:ring-red-300 transition-all animate-in fade-in slide-in-from-top-2 duration-200"
              role="alert"
              aria-live="assertive"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0 font-bold border border-red-200">
                  <span className="material-symbols-outlined text-[24px]">gavel</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h4 className="text-[15px] font-extrabold text-red-900">
                      Upload Prevented & Blocked
                    </h4>
                    <span className="px-2 py-0.5 bg-red-200 text-red-900 text-[10px] uppercase font-mono-data font-bold rounded">
                      18+ & Safety Violations Prohibited
                    </span>
                  </div>
                  <p className="text-[13px] text-red-800 font-semibold leading-relaxed">
                    {uploadError}
                  </p>
                  <p className="text-[11px] text-red-600 mt-2 font-mono-data">
                    Safety Rule: Adult content, explicit nudity, non-medical gore, or disturbing images are strictly prohibited.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setUploadError(null)}
                  className="text-red-500 hover:text-red-800 p-1.5 rounded-lg hover:bg-red-100 transition-colors shrink-0"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>
            </div>
          )}

          {/* Scanning Feedback Spinner Banner */}
          {isScanning && (
            <div className="p-4 bg-sky-50 border border-sky-300 rounded-2xl flex items-center gap-3 animate-pulse">
              <div className="w-6 h-6 border-3 border-[#003178] border-t-transparent rounded-full animate-spin shrink-0" />
              <div>
                <p className="text-[13px] font-extrabold text-[#003178]">
                  Scanning image with Gemini Vision AI...
                </p>
                <p className="text-[11px] text-sky-700 font-mono-data">
                  Evaluating content safety guard rules against 18+ explicit material, violence, and non-compliant imagery.
                </p>
              </div>
            </div>
          )}

          {/* SECTION 1: Image Upload & Real-time AI Moderation */}
          <div className="p-5 bg-gray-50 border border-gray-200 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-[13px] font-extrabold text-[#071e27] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#003178] text-[20px]">photo_camera</span>
                <span>Equipment Image / Diagnostic Scan</span>
              </label>

              <button
                type="button"
                onClick={handleAutoExtractSpecs}
                disabled={isScanning}
                className="px-3 py-1.5 bg-[#003178] hover:bg-[#002256] text-white text-[11px] font-extrabold rounded-xl transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                <span>🤖 Auto-Extract Specs with AI Vision</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Local File Selector */}
              <div>
                <label className="block text-[11px] font-bold text-[#434652] mb-1">
                  Local File Selection:
                </label>
                <input
                  ref={imageFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLocalFileSelect}
                  className="block w-full text-[12px] text-gray-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-[12px] file:font-bold file:bg-[#003178]/10 file:text-[#003178] hover:file:bg-[#003178]/20 cursor-pointer"
                />
              </div>

              {/* Image URL Input */}
              <div>
                <label className="block text-[11px] font-bold text-[#434652] mb-1">
                  Or Image Web URL / Data URI:
                </label>
                <input
                  type="text"
                  placeholder="https://example.com/equipment.jpg"
                  value={imageUrl}
                  onChange={(e) => handleUrlInputChange(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-[12px] font-semibold text-[#071e27] focus:outline-none focus:border-[#003178]"
                />
              </div>
            </div>

            {/* Invoice Bill Attachment Uploads */}
            <div>
              <label className="block text-[11px] font-bold text-[#434652] mb-1">
                Invoice Bill Attachment Upload:
              </label>
              <input
                ref={invoiceFileInputRef}
                type="file"
                accept="image/*,.pdf"
                onChange={handleInvoiceFileSelect}
                className="block w-full text-[12px] text-gray-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-[12px] file:font-bold file:bg-[#006f66]/10 file:text-[#006f66] hover:file:bg-[#006f66]/20 cursor-pointer"
              />
            </div>
          </div>

          {/* SECTION 2: Item Specification Details */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-bold text-[#071e27] mb-1">
                  Equipment / Item Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Laparoscopic Surgical Tower"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-[13px] font-semibold focus:outline-none focus:border-[#003178]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#071e27] mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-[13px] font-semibold focus:outline-none focus:border-[#003178]"
                >
                  <option value="Surgical Equipment">Surgical Equipment</option>
                  <option value="Radiology & Imaging">Radiology & Imaging</option>
                  <option value="ICU & OT Monitors">ICU & OT Monitors</option>
                  <option value="Invoice Bill Attachment">Invoice Bill Attachment</option>
                  <option value="Diagnostic Lab Device">Diagnostic Lab Device</option>
                </select>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#071e27] mb-1">
                  Model Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. ST-8800-PRO"
                  value={modelNumber}
                  onChange={(e) => setModelNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-[13px] font-semibold font-mono-data focus:outline-none focus:border-[#003178]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#071e27] mb-1">
                  Serial Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. SN-2026-991A"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-[13px] font-semibold font-mono-data focus:outline-none focus:border-[#003178]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#071e27] mb-1">
                  Bill Amount (INR ₹)
                </label>
                <input
                  type="number"
                  placeholder="245000"
                  value={invoiceAmountINR}
                  onChange={(e) => setInvoiceAmountINR(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-[13px] font-semibold font-mono-data focus:outline-none focus:border-[#003178]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#071e27] mb-1">
                  Calibration Status
                </label>
                <select
                  value={calibrationStatus}
                  onChange={(e) => setCalibrationStatus(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-[13px] font-semibold focus:outline-none focus:border-[#003178]"
                >
                  <option value="Calibrated">Calibrated</option>
                  <option value="Pending Calibration">Pending Calibration</option>
                  <option value="Maintenance Required">Maintenance Required</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-bold text-[#071e27] mb-1">
                Equipment Specifications
              </label>
              <textarea
                rows={3}
                placeholder="Technical specifications, camera head resolution, cold light source wattage, etc."
                value={specifications}
                onChange={(e) => setSpecifications(e.target.value)}
                className="w-full p-3 bg-white border border-gray-300 rounded-xl text-[13px] font-normal leading-relaxed focus:outline-none focus:border-[#003178]"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between gap-3 pt-4 border-t border-gray-200">
            <div>
              {itemToEdit && onDelete && (
                <button
                  type="button"
                  onClick={() => {
                    if (itemToEdit?.id) {
                      onDelete(itemToEdit.id);
                      onClose();
                    }
                  }}
                  className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-[13px] font-extrabold rounded-xl border border-red-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Delete item permanently"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                  <span>Delete Record</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-[#071e27] text-[13px] font-bold rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isScanning || safetyStatus === 'Blocked (Safety Violation)'}
                className={`px-6 py-2.5 text-white text-[13px] font-extrabold rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer ${
                  safetyStatus === 'Blocked (Safety Violation)'
                    ? 'bg-red-400 cursor-not-allowed opacity-60'
                    : 'bg-[#003178] hover:bg-[#002256]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">save</span>
                <span>Save Record</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
