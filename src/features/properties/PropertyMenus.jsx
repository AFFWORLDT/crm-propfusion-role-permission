import Menus from "../../ui/Menus";
import Modal from "../../ui/Modal";
import styles from "./PropertyMenus.module.css";
import { useAuth } from "../../context/AuthContext";
import SocialMediaShare from "../../components/SocialMediaShare";
import { useState } from "react";

function PropertyMenus({ data }) {
    const { currentUser } = useAuth();


    return (
        <div className={styles.propertyMenus}>
            <Modal>
                <Menus>
                    <Menus.Toggle id={data.id} />

                    <Menus.List id={data.id}>
                    <Menus.Button
                        icon="/icons/share-premium.svg"
                        onClick={() =>
                            window.open(
                                `/share-premium/${data.listingType.toLowerCase()}/${data.propertyId}?pdf=1&userId=${currentUser?.id}`,
                                "_blank",
                                "noopener,noreferrer"
                            )
                        }
                    >
                        Premium PDF
                    </Menus.Button>

                    <Menus.Button
                        icon="/icons/share.svg"
                        onClick={() =>
                            window.open(
                                `/share-property/${data.listingType.toLowerCase()}/${data.propertyId}?pdf=1&userId=${currentUser?.id}`,
                                "_blank",
                                "noopener,noreferrer"
                            )
                        }
                    >
                        Share PDF
                    </Menus.Button>

                    <Modal.Open openWindowName="socialMediaShare">
                        <Menus.Button icon="/icons/share-social.svg">
                            Share to Social Media
                        </Menus.Button>
                    </Modal.Open>

                    <Menus.Button
                        icon="/icons/share.svg"
                        onClick={() =>
                            window.open(
                                `/share-property/${data.listingType.toLowerCase()}/${data.propertyId}?userId=${currentUser?.id}`,
                                "_blank",
                                "noopener,noreferrer"
                            )
                        }
                    >
                        Share Link
                    </Menus.Button>

                    <Menus.Button
                        icon="/icons/eye.svg"
                        onClick={() =>
                            window.open(
                                `/viewing-property/${data.listingType.toLowerCase()}/${data.propertyId}`,
                                "_blank",
                                "noopener,noreferrer"
                            )
                        }
                    >
                        Viewing Link
                    </Menus.Button>
                </Menus.List>
                </Menus>

                {/* Social Media Share Modal */}
                <Modal.Window name="socialMediaShare">
                    <SocialMediaShare 
                        property={data}
                    />
                </Modal.Window>
            </Modal>
        </div>
    );
}

export default PropertyMenus;
