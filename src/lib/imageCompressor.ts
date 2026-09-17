/**
 * High-performance client-side image compressor & auto-scaler.
 * Optimizes large mobile camera photos (5MB - 25MB, 4000x3000+ px)
 * into lightweight, web-optimized images (80KB - 250KB, 1280px max)
 * in < 100ms before network transmission.
 */

export interface CompressionResult {
  file: File;
  originalSize: number;
  compressedSize: number;
  dataUrl?: string;
}

export async function compressImageForMobile(
  file: File,
  maxDimension = 1280,
  quality = 0.82
): Promise<File> {
  // If not an image (e.g. PDF datasheet) or already very small (< 100KB), return as is
  if (!file.type.startsWith('image/') || file.size < 100 * 1024) {
    return file;
  }

  return new Promise((resolve) => {
    // If FileReader fails or is unavailable, fallback gracefully to original file
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let width = img.width;
          let height = img.height;

          // Scale down proportionally if larger than maxDimension
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(file);
            return;
          }

          // Draw high-quality image
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);

          // Use image/jpeg for wide mobile compatibility and small payload
          const outputMime = 'image/jpeg';
          canvas.toBlob(
            (blob) => {
              if (blob && blob.size < file.size) {
                const newName = file.name.replace(/\.[^/.]+$/, '') + '.jpg';
                const optimizedFile = new File([blob], newName, {
                  type: outputMime,
                  lastModified: Date.now(),
                });
                resolve(optimizedFile);
              } else {
                resolve(file);
              }
            },
            outputMime,
            quality
          );
        };

        img.onerror = () => {
          console.warn('Image loading for compression failed, using original file.');
          resolve(file);
        };

        img.src = e.target?.result as string;
      };

      reader.onerror = () => resolve(file);
      reader.readAsDataURL(file);
    } catch (err) {
      console.warn('Compression exception, using original file:', err);
      resolve(file);
    }
  });
}
