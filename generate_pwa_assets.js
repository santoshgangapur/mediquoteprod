import fs from 'fs';
import zlib from 'zlib';

function createPngBuffer(width, height, r, g, b) {
  // Signature
  const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 2; // color type: RGB
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace

  const ihdrChunk = createChunk('IHDR', ihdrData);

  // IDAT data (scanlines with filter byte 0)
  const scanlineLength = 1 + width * 3;
  const rawData = Buffer.alloc(height * scanlineLength);

  for (let y = 0; y < height; y++) {
    const offset = y * scanlineLength;
    rawData[offset] = 0; // Filter type 0
    for (let x = 0; x < width; x++) {
      const pixelOffset = offset + 1 + x * 3;
      // Draw a nice medical pattern or solid background with border/accent
      const isCross = (x > width * 0.4 && x < width * 0.6 && y > height * 0.25 && y < height * 0.75) ||
                      (y > height * 0.4 && y < height * 0.6 && x > width * 0.25 && x < width * 0.75);
      if (isCross) {
        rawData[pixelOffset] = 129;     // R
        rawData[pixelOffset + 1] = 243; // G
        rawData[pixelOffset + 2] = 229; // B (#81f3e5 teal)
      } else {
        rawData[pixelOffset] = r;
        rawData[pixelOffset + 1] = g;
        rawData[pixelOffset + 2] = b;
      }
    }
  }

  const compressedData = zlib.deflateSync(rawData);
  const idatChunk = createChunk('IDAT', compressedData);

  // IEND
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const len = data.length;
  const buf = Buffer.alloc(8 + len + 4);
  buf.writeUInt32BE(len, 0);
  buf.write(type, 4, 4, 'ascii');
  data.copy(buf, 8);

  const crcVal = crc32(buf.subarray(4, 8 + len));
  buf.writeUInt32BE(crcVal >>> 0, 8 + len);
  return buf;
}

// CRC32 implementation
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    if (c & 1) c = 0xedb88320 ^ (c >>> 1);
    else c = c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return crc ^ 0xffffffff;
}

// Generate PWA icons and screenshots
if (!fs.existsSync('./public')) {
  fs.mkdirSync('./public');
}

fs.writeFileSync('./public/icon-192.png', createPngBuffer(192, 192, 0, 49, 120)); // #003178
fs.writeFileSync('./public/icon-512.png', createPngBuffer(512, 512, 0, 49, 120)); // #003178
fs.writeFileSync('./public/screenshot-desktop.png', createPngBuffer(1280, 720, 240, 247, 255)); // #f0f7ff
fs.writeFileSync('./public/screenshot-mobile.png', createPngBuffer(750, 1334, 240, 247, 255)); // #f0f7ff

console.log('Successfully generated PWA PNG assets in public directory!');
