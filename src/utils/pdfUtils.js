// Utility function to convert image URL to base64 for react-pdf
const imageCache = new Map();

export const convertImageToBase64 = async (imageUrl) => {
  try {
    // If it's already a base64 data URL, return as is
    if (imageUrl.startsWith('data:')) {
      return imageUrl;
    }

    // If it's a placeholder or test image, return as is
    if (imageUrl.includes('placeholder') || imageUrl.includes('via.placeholder')) {
      return imageUrl;
    }

    // Cache hit
    if (imageCache.has(imageUrl)) {
      return imageCache.get(imageUrl);
    }

    // Try fetch->blob->FileReader first (better for CORS)
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 10000);
      const res = await fetch(imageUrl, { mode: 'cors', signal: controller.signal });
      clearTimeout(timer);
      if (res.ok) {
        const blob = await res.blob();
        const dataUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
        imageCache.set(imageUrl, dataUrl);
        return dataUrl;
      }
    } catch (e) {
      // fall back to image/canvas path
    }

    // Fallback: Create a new image element and draw to canvas
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        console.warn('Image loading timeout:', imageUrl);
        resolve(imageUrl); // Return original URL as fallback
      }, 10000); // 10 second timeout
      
      img.onload = () => {
        clearTimeout(timeout);
        try {
          // Create a canvas to convert image to base64
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          canvas.width = img.width;
          canvas.height = img.height;
          
          ctx.drawImage(img, 0, 0);
          
          // Convert to base64
          const base64 = canvas.toDataURL('image/png');
          imageCache.set(imageUrl, base64);
          resolve(base64);
        } catch (error) {
          console.warn('Failed to convert image to base64:', error);
          // Return original URL as fallback
          resolve(imageUrl);
        }
      };
      
      img.onerror = () => {
        clearTimeout(timeout);
        console.warn('Failed to load image:', imageUrl);
        // Return original URL as fallback
        resolve(imageUrl);
      };
      
      img.src = imageUrl;
    });
  } catch (error) {
    console.warn('Error in convertImageToBase64:', error);
    return imageUrl;
  }
};

// Function to preload and convert all images in card data
export const prepareCardDataForPDF = async (cardData) => {
  try {
    const preparedData = { ...cardData };
    
    // Convert company logo if it exists
    if (cardData.company_logo_url) {
      preparedData.company_logo_url = await convertImageToBase64(cardData.company_logo_url);
    }
    
    return preparedData;
  } catch (error) {
    console.warn('Error preparing card data for PDF:', error);
    return cardData;
  }
};
