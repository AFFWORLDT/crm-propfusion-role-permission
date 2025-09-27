import * as React from "react";
import Lightbox from "yet-another-react-lightbox";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Captions from "yet-another-react-lightbox/plugins/captions";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";

import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

function PropertyLightboxGallery({ images }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const slides = images.map(url => ({
    src: url,
    loading: "lazy",
    alt: "Property image"
  }));

  const galleryStyle = {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(250px, 1fr))",
    gap: isMobile ? "8px" : "16px",
    cursor: "pointer",
  };

  const imageContainerStyle = {
    position: "relative",
    paddingTop: "75%", // 4:3 aspect ratio
    overflow: "hidden",
    borderRadius: "8px",
    backgroundColor: "#f5f5f5"
  };

  const imageStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.3s ease-in-out",
    "&:hover": {
      transform: "scale(1.05)"
    }
  };

  const overlayStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.201)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontSize: isMobile ? "20px" : "24px",
    fontWeight: "bold",
    cursor: "pointer"
  };

  const displayImages = isMobile ? images.slice(0, 1) : images.slice(0, 6);
  const remainingCount = images.length - (isMobile ? 1 : 6);

  return (
    <div>
      <div style={galleryStyle}>
        {displayImages.map((url, index) => (
          <div key={url} style={imageContainerStyle}>
            <img
              src={url}
              alt={`Property image ${index + 1}`}
              style={imageStyle}
              onClick={() => {
                setCurrentImageIndex(index);
                setIsOpen(true);
              }}
            />
            {((isMobile && index === 0) || (!isMobile && index === 5)) && remainingCount > 0 && (
              <div 
                style={overlayStyle}
                onClick={() => {
                  setCurrentImageIndex(index);
                  setIsOpen(true);
                }}
              >
                +{remainingCount} more
              </div>
            )}
          </div>
        ))}
      </div>

      <Lightbox
        open={isOpen}
        close={() => setIsOpen(false)}
        index={currentImageIndex}
        slides={slides}
        plugins={[Captions, Fullscreen, Slideshow, Thumbnails, Zoom]}
        carousel={{
          spacing: 8,
          padding: 16,
          imageFit: "contain"
        }}
        thumbnails={{
          position: "bottom",
          width: isMobile ? 80 : 120,
          height: isMobile ? 60 : 80,
          border: 2,
          borderRadius: 4,
          padding: 4,
          gap: isMobile ? 8 : 16
        }}
        zoom={{
          maxZoomPixelRatio: 3,
          zoomInMultiplier: 2,
          doubleTapDelay: 300,
          doubleClickDelay: 300,
          doubleClickMaxStops: 2,
          wheelZoomDistanceFactor: 100,
          pinchZoomDistanceFactor: 100
        }}
        animation={{
          swipe: 250
        }}
        render={{
          buttonPrev: () => null,
          buttonNext: () => null
        }}
        styles={{
          container: {
            backgroundColor: "rgba(0, 0, 0, 0.8)"
          }
        }}
      />
    </div>
  );
}

export default PropertyLightboxGallery; 