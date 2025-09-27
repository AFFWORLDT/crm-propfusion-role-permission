import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

function VehicleImageGallery({ images }) {
    return (
        <ImageGallery
            additionalClass="vehicleImageGallery"
            items={images}
            showNav={false}
            thumbnailPosition="right"
            showPlayButton={false}
        />
    );
}

export default VehicleImageGallery; 