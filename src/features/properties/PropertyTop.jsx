import PropertyImageGallery from "./PropertyImageGallery.jsx";
import AgentContact from "../../ui/AgentContact.jsx";
import styles from "../../styles/ListingItemTop.module.css";
import { formatNum } from "../../utils/utils";
import PropertyMenus from "./PropertyMenus.jsx";
import { Link, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid"; 
function PropertyTop({ data }) {
    // Fetch the projectId from the URL using useParams
    const { propertyId } = useParams(); 
    const randomId = uuidv4();
    return (
        <div className={`sectionDiv ${styles.listingItemTop}`}>
            <PropertyImageGallery
                images={data.photos.map((url) => {
                    return {
                        original: url,
                        thumbnail: url,
                    };
                })}
            />

            <div className={styles.listingItemTopContent}>
                <PropertyMenus data={data} />

                <span className={styles.status}>{data.status}</span>

                <h1>{data.title}</h1> 

                <p className={styles.location}> 
                    <img src="/icons/location.svg" alt="" />
                    <span>
                        {/* Link to the address route with the projectId */}
                      
                            {data.region}
                       
                    </span>  
                </p>

                <p className={styles.price}> 
                    <span>
                        {data.price
                            ? `AED ${formatNum(data.price)}`
                            : "Not specified"}
                        {data?.rentParam?.priceType
                            ? ` / ${data.rentParam.priceType}`
                            : ""}
                    </span>
                </p>

                <div className={styles.type}>
                    {data.propertyType.map((type) => (
                        <span key={type}>
                            {type[0] + type.slice(1).toLowerCase()}
                        </span>
                    ))}
                </div>

                <p className={styles.community}>
                    <span>Community: </span>
                    <span>{data.community}</span>
                </p>

                <p className={styles.developer}>
                    <span>Developer: </span>
                    <span>{data.developer}</span>
                </p>

                <AgentContact
                    agentAvatar={data?.agent?.avatar}
                    agentName={data?.agent?.name}
                    agentPhone={data?.agent?.phone}
                    agentMail={data?.agent?.email}
                />
            </div>
        </div>
    );
}

export default PropertyTop;
