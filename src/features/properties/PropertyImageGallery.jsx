import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

function PropertyImageGallery({ images }) {
    return (
        <ImageGallery
            additionalClass="propertyImageGallery"
            items={images}
            showNav={false}
            thumbnailPosition="right"
            showPlayButton={false}
        />
    );
}

export default PropertyImageGallery;