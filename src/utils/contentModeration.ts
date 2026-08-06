export interface ModerationResult {
  isSafe: boolean;
  blockedFileName?: string;
  errorMessage?: string;
}

// Banned keywords for 18+, adult, explicit, gore, or disturbing content
const BANNED_KEYWORDS = [
  '18+', '18plus', 'adult', 'nsfw', 'porn', 'xxx', 'nude', 'nudity', 'sex', 'erotic',
  'gore', 'bloody_graphic', 'disturbing', 'mutilation', 'violence', 'blood_gore',
  'explicit', 'hentai', 'bikini_nude', 'erotica', 'disturb', 'horror', 'suicide',
  'kill', 'slaughter', 'orgasm', 'penis', 'vagina', 'boobs', 'topless', 'intercourse'
];

/**
 * Validates files against 18+ explicit content, NSFW material, and disturbing non-medical images.
 */
export async function validateMedicalFiles(files: File[]): Promise<ModerationResult> {
  for (const file of files) {
    const fileNameLower = file.name.toLowerCase();

    // 1. Keyword check in filename
    for (const keyword of BANNED_KEYWORDS) {
      if (fileNameLower.includes(keyword.toLowerCase())) {
        return {
          isSafe: false,
          blockedFileName: file.name,
          errorMessage: `⚠️ Upload Blocked: 18+ explicit or disturbing content detected in "${file.name}". Only legitimate medical records (e.g. diagnostic reports, lab results, MRI/CT scans, prescriptions) are allowed.`,
        };
      }
    }

    // 2. File extension check for non-medical executable or video formats that may carry explicit content
    const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png', '.dcm', '.dicom', '.zip', '.docx', '.txt'];
    const hasValidExt = allowedExtensions.some((ext) => fileNameLower.endsWith(ext));
    if (!hasValidExt) {
      return {
        isSafe: false,
        blockedFileName: file.name,
        errorMessage: `⚠️ Upload Blocked: "${file.name}" is not a recognized medical file format. Please upload PDF, DICOM, JPEG, PNG, or DOCX records.`,
      };
    }

    // 3. Call server-side AI Vision Moderation (/api/moderate-image) if file is an image
    if (file.type.startsWith('image/')) {
      try {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        const res = await fetch('/api/moderate-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: base64,
            mimeType: file.type,
            fileName: file.name
          })
        });

        const data = await res.json();
        if (!data.isSafe) {
          return {
            isSafe: false,
            blockedFileName: file.name,
            errorMessage: data.reason || `⚠️ Upload Blocked: 18+ explicit or disturbing content detected in "${file.name}".`
          };
        }
      } catch (err) {
        console.warn('Server moderation call failed, falling back to local scan:', err);
      }

      const isImageSafe = await scanImageForInappropriateContent(file);
      if (!isImageSafe) {
        return {
          isSafe: false,
          blockedFileName: file.name,
          errorMessage: `⚠️ Upload Blocked: 18+ or disturbing content detected in image "${file.name}". Uploads are automatically scanned to ensure medical safety compliance.`,
        };
      }
    }
  }

  return { isSafe: true };
}

/**
 * Performs a client-side canvas scan on image files to detect non-medical or inappropriate/explicit content.
 */
function scanImageForInappropriateContent(file: File): Promise<boolean> {
  return new Promise((resolve) => {
    // If the filename specifically contains medical terms like scan, report, mri, ct, lab, x-ray, blood, ultrasound, etc.
    const lowerName = file.name.toLowerCase();
    const isMedicalName = ['scan', 'mri', 'ct', 'xray', 'x-ray', 'report', 'lab', 'blood', 'ultrasound', 'prescription', 'ecg', 'eag', 'dicom', 'pathology'].some((term) => lowerName.includes(term));

    const reader = new FileReader();
    reader.onerror = () => resolve(true); // default pass if unreadable
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => resolve(true);
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) return resolve(true);

          canvas.width = 100;
          canvas.height = 100;
          ctx.drawImage(img, 0, 0, 100, 100);

          const imageData = ctx.getImageData(0, 0, 100, 100);
          const data = imageData.data;

          let redDominantPixels = 0;
          let skinPixels = 0;
          const totalPixels = 100 * 100;

          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            // Detect extreme red saturation (graphic gore/blood indicator)
            if (r > 200 && g < 50 && b < 50) {
              redDominantPixels++;
            }

            // Detect skin-tone pixel ranges (explicit/nudity indicator)
            if (r > 95 && g > 40 && b > 20 && Math.max(r, g, b) - Math.min(r, g, b) > 15 && Math.abs(r - g) > 15 && r > g && r > b) {
              skinPixels++;
            }
          }

          // Flag if over 80% skin tones or over 60% vivid blood red without being a named medical report
          if (!isMedicalName) {
            if (skinPixels / totalPixels > 0.82) {
              return resolve(false); // Flagged as potential 18+ explicit image
            }
            if (redDominantPixels / totalPixels > 0.65) {
              return resolve(false); // Flagged as potential disturbing gore
            }
          }

          resolve(true);
        } catch {
          resolve(true);
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}
