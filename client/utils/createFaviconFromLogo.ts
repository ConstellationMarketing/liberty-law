/**
 * Creates a dark/inverted version of the logo for use as favicon
 * Converts white/light colors to dark colors so it's visible in browser tabs
 */
export function createFaviconFromLogo(logoUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      // Create canvas with appropriate size for favicon (32x32 is standard)
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      // Set canvas size to 32x32 for favicon
      canvas.width = 32;
      canvas.height = 32;
      
      // Draw the image scaled to fit
      ctx.drawImage(img, 0, 0, 32, 32);
      
      // Get image data
      const imageData = ctx.getImageData(0, 0, 32, 32);
      const data = imageData.data;
      
      // Invert colors (convert white to black, etc.)
      for (let i = 0; i < data.length; i += 4) {
        // Invert RGB channels, keep alpha
        data[i] = 255 - data[i];         // Red
        data[i + 1] = 255 - data[i + 1]; // Green
        data[i + 2] = 255 - data[i + 2]; // Blue
        // data[i + 3] stays the same (alpha/transparency)
      }
      
      // Put modified image data back
      ctx.putImageData(imageData, 0, 0);
      
      // Convert to data URL
      const dataUrl = canvas.toDataURL('image/png');
      resolve(dataUrl);
    };
    
    img.onerror = () => {
      // If image fails to load, return original URL
      console.warn('Failed to load logo for favicon inversion, using original');
      resolve(logoUrl);
    };
    
    img.src = logoUrl;
  });
}
