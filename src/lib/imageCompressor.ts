/**
 * High-performance client-side image compressor & auto-scaler for Creative Learning.
 * Optimizes large smartphone camera photos (5MB - 25MB, 4000x3000+ px)
 * into ultra-crisp, lightweight, web-optimized JPEG images (~80KB - 200KB, 1400px max)
 * in < 100ms before network transmission.
 */

export interface CompressionResult {
  file: File;
  originalSize: number;
  compressedSize: number;
  dataUrl?: string;
}

/**
 * Checks whether a given file is an image by MIME type or file extension.
 */
export function isImageFile(file: File): boolean {
  if (!file) return false;
  if (file.type && file.type.toLowerCase().startsWith('image/')) {
    return true;
  }
  const ext = file.name ? file.name.split('.').pop()?.toLowerCase() : '';
  return ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'heic', 'heif', 'avif', 'tiff', 'svg'].includes(ext || '');
}

/**
 * Auto-compresses and resizes high-resolution photos in browser memory.
 * Converts heavy formats (PNG, HEIC, high-res JPEG) into lightweight 1400px max JPEGs.
 */
export async function compressImageForMobile(
  file: File,
  maxDimension = 1400,
  quality = 0.85
): Promise<File> {
  // If not an image (e.g. PDF datasheet) or already an SVG / very small (< 50KB), return as is
  if (!isImageFile(file) || file.type === 'image/svg+xml' || (file.size < 50 * 1024 && !file.name.toLowerCase().endsWith('.png'))) {
    return file;
  }

  return new Promise((resolve) => {
    try {
      const url = URL.createObjectURL(file);
      const img = new Image();

      const cleanup = () => {
        try {
          URL.revokeObjectURL(url);
        } catch (_) {}
      };

      img.onload = () => {
        try {
          let width = img.naturalWidth || img.width;
          let height = img.naturalHeight || img.height;

          if (!width || !height) {
            cleanup();
            resolve(file);
            return;
          }

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
            cleanup();
            resolve(file);
            return;
          }

          // Fill with clean white background in case source has transparency or alpha
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, width, height);

          // Draw high-quality image with smooth interpolation
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);

          const outputMime = 'image/jpeg';
          const cleanBaseName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');
          const newName = `${cleanBaseName || 'photo'}.jpg`;

          if (typeof canvas.toBlob === 'function') {
            canvas.toBlob(
              (blob) => {
                cleanup();
                if (blob) {
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
          } else {
            // Fallback via data URL
            const dataUrl = canvas.toDataURL(outputMime, quality);
            cleanup();
            const arr = dataUrl.split(',');
            const mime = arr[0].match(/:(.*?);/)?.[1] || outputMime;
            const bstr = atob(arr[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);
            while (n--) {
              u8arr[n] = bstr.charCodeAt(n);
            }
            const fallbackBlob = new Blob([u8arr], { type: mime });
            const optimizedFile = new File([fallbackBlob], newName, {
              type: outputMime,
              lastModified: Date.now(),
            });
            resolve(optimizedFile);
          }
        } catch (procErr) {
          console.warn('Canvas image compression exception, using original file:', procErr);
          cleanup();
          resolve(file);
        }
      };

      img.onerror = () => {
        cleanup();
        // Secondary fallback using FileReader
        const reader = new FileReader();
        reader.onload = (e) => {
          const fallbackImg = new Image();
          fallbackImg.onload = () => {
            try {
              const canvas = document.createElement('canvas');
              let w = fallbackImg.width;
              let h = fallbackImg.height;
              if (w > maxDimension || h > maxDimension) {
                if (w > h) {
                  h = Math.round((h * maxDimension) / w);
                  w = maxDimension;
                } else {
                  w = Math.round((w * maxDimension) / h);
                  h = maxDimension;
                }
              }
              canvas.width = w;
              canvas.height = h;
              const ctx = canvas.getContext('2d');
              if (ctx) {
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, w, h);
                ctx.drawImage(fallbackImg, 0, 0, w, h);
                canvas.toBlob((blob) => {
                  if (blob) {
                    resolve(new File([blob], file.name.replace(/\.[^/.]+$/, '') + '.jpg', { type: 'image/jpeg' }));
                  } else {
                    resolve(file);
                  }
                }, 'image/jpeg', quality);
                return;
              }
            } catch (_) {}
            resolve(file);
          };
          fallbackImg.onerror = () => resolve(file);
          fallbackImg.src = e.target?.result as string;
        };
        reader.onerror = () => resolve(file);
        reader.readAsDataURL(file);
      };

      img.src = url;
    } catch (err) {
      console.warn('Compression exception, using original file:', err);
      resolve(file);
    }
  });
}

/**
 * Converts any image file into a highly-compressed, lightweight Base64 Data URL (~80KB - 150KB)
 * for seamless zero-network or fallback storage.
 */
export async function compressImageToDataUrl(
  file: File,
  maxDimension = 1200,
  quality = 0.8
): Promise<string> {
  return new Promise((resolve) => {
    if (!isImageFile(file)) {
      const reader = new FileReader();
      reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
      return;
    }

    try {
      const url = URL.createObjectURL(file);
      const img = new Image();

      const cleanup = () => {
        try {
          URL.revokeObjectURL(url);
        } catch (_) {}
      };

      img.onload = () => {
        try {
          let width = img.naturalWidth || img.width;
          let height = img.naturalHeight || img.height;

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
            cleanup();
            const reader = new FileReader();
            reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
            reader.readAsDataURL(file);
            return;
          }

          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, width, height);
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);

          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          cleanup();
          resolve(dataUrl);
        } catch (_) {
          cleanup();
          const reader = new FileReader();
          reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
          reader.readAsDataURL(file);
        }
      };

      img.onerror = () => {
        cleanup();
        const reader = new FileReader();
        reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
        reader.readAsDataURL(file);
      };

      img.src = url;
    } catch (_) {
      const reader = new FileReader();
      reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
      reader.readAsDataURL(file);
    }
  });
}
