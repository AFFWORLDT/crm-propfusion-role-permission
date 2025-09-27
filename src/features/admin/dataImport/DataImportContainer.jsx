import { useState } from "react";
import styles from "../../../styles/TabContainer.module.css";
import { DATA_IMPORT_TAB_LIST } from "../../../utils/constants";
import Listings from "./Listings";
import Listingarea from "./ListingArea"
import ListDeveloper from './ListDeveloper'
import ListLead from "./ListLead";
import ListPortalCalls from "./ListPortalCalls";
import ListFacebook from "./ListFacebook";

function DataImportContainer() {
    const [activeDataImport, setActiveDataImport] = useState(DATA_IMPORT_TAB_LIST[0].value);
  
    return (
        <>
        <div className={styles.tabContainer}>
            <ul>
                {DATA_IMPORT_TAB_LIST.map((item) => (
                    <li
                        className={
                            item.value === activeDataImport
                                ? styles.activeTab
                                : ""
                        }  
                        key={item.value}
                    >
                        <button onClick={() => setActiveDataImport(item.value)}> 
                            {item.label}
                        </button>
                    </li>
                ))}
            </ul>

            <div className={styles.tabDetails}>
                {activeDataImport === "listings" && <Listings />} 
                {activeDataImport === "Area" && <Listingarea/>} 
                {activeDataImport === "Developer" && <ListDeveloper/>} 
                {activeDataImport === "Leads" && <ListLead/>}
                {activeDataImport === "Portal Calls" && <ListPortalCalls/>}
                {activeDataImport === "Facebook" && <ListFacebook/>}

                {/* {activeDataImport === "Developer" && <ListDeveloper/>}  */}
            </div>
           
        </div>
      {/*  */}
        </>
    );
}

export default DataImportContainer;
