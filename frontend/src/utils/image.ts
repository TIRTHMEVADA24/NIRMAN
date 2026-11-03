export const DEFAULT_PRODUCT_FALLBACK = "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=500";

export function parseImages(images: any, fallback: string = DEFAULT_PRODUCT_FALLBACK): string {
  if (!images) return fallback;

  if (Array.isArray(images)) {
    const valid = images.find(img => typeof img === 'string' && img.trim().length > 0 && img !== '[]' && img !== 'null' && img !== '""');
    return valid ? valid.trim() : fallback;
  }

  if (typeof images === 'string') {
    const trimmed = images.trim();
    if (!trimmed || trimmed === '[]' || trimmed === 'null' || trimmed === 'undefined' || trimmed === '{}' || trimmed === '""') {
      return fallback;
    }
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        if (parsed.length === 0) return fallback;
        const valid = parsed.find(img => typeof img === 'string' && img.trim().length > 0 && img !== '[]' && img !== 'null');
        return valid ? valid.trim() : fallback;
      }
      if (typeof parsed === 'string' && parsed.trim().length > 0 && parsed !== '[]' && parsed !== 'null') {
        return parsed.trim();
      }
      return fallback;
    } catch {
      // Direct string or URL
      return trimmed;
    }
  }

  return fallback;
}

export function parseImageList(images: any, fallback: string = DEFAULT_PRODUCT_FALLBACK): string[] {
  if (!images) return fallback ? [fallback] : [];

  if (Array.isArray(images)) {
    const valid = images.filter(img => typeof img === 'string' && img.trim().length > 0 && img !== '[]' && img !== 'null');
    return valid.length > 0 ? valid : (fallback ? [fallback] : []);
  }

  if (typeof images === 'string') {
    const trimmed = images.trim();
    if (!trimmed || trimmed === '[]' || trimmed === 'null' || trimmed === 'undefined' || trimmed === '{}' || trimmed === '""') {
      return fallback ? [fallback] : [];
    }
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        const valid = parsed.filter(img => typeof img === 'string' && img.trim().length > 0 && img !== '[]' && img !== 'null');
        return valid.length > 0 ? valid : (fallback ? [fallback] : []);
      }
      if (typeof parsed === 'string' && parsed.trim().length > 0 && parsed !== '[]' && parsed !== 'null') {
        return [parsed.trim()];
      }
      return fallback ? [fallback] : [];
    } catch {
      return [trimmed];
    }
  }

  return fallback ? [fallback] : [];
}

export function getManufacturerImages(name: string): { logo: string; banner: string } {
  const lowercaseName = (name || "").toLowerCase();
  if (lowercaseName.includes("artisan") || lowercaseName.includes("amit")) {
    return {
      logo: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=150&h=150",
      banner: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200&h=400"
    };
  }
  if (lowercaseName.includes("silver") || lowercaseName.includes("desai") || lowercaseName.includes("meera")) {
    return {
      logo: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=150&h=150",
      banner: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=1200&h=400"
    };
  }
  if (lowercaseName.includes("golden") || lowercaseName.includes("craft") || lowercaseName.includes("rajesh")) {
    return {
      logo: "https://images.unsplash.com/photo-1534224039826-c7a0eda0e6b3?auto=format&fit=crop&q=80&w=150&h=150",
      banner: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1200&h=400"
    };
  }
  return {
    logo: "https://images.unsplash.com/photo-1556761175-b813f57a32f6?auto=format&fit=crop&q=80&w=150&h=150",
    banner: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200&h=400"
  };
}

export function resizeImageFile(file: File, maxWidth = 800, maxHeight = 800, quality = 0.8): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}
