import { useEffect } from "react";
import Spinner from "./Spinner";
import TabsStyle from "./BootstrapTabs.module.css";
import PlotMap from "./PlotMap";
import toast from "react-hot-toast";
import useAreasWithoutCount from "../features/areas/useAreasWithoutCount";
import useNewPropertiesForMaps from "../features/properties/useNewPropertiesForMaps";
import { useSearchParams } from "react-router-dom";
import useNewProjectForMaps from "../features/newProjects/useNewProjectFroMap";

const BootstrapTabs = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const listingType = searchParams.get("listingType");
    const activeTab =
        listingType === "RENT"
            ? "RentList"
            : listingType === "SELL"
              ? "SellList"
              : null;

    // AreaList functionality
    const {
        isLoading: areasLoading,
        data: areasData,
        error: areasError,
    } = useAreasWithoutCount(true);

    useEffect(() => {
        if (areasError) toast.error(areasError.message);
    }, [areasError]);

    const {
        isLoading: propertiesLoading,
        data: propertiesData,
        error: propertiesError,
    } = useNewPropertiesForMaps();

    useEffect(() => {
        if (propertiesError) toast.error(propertiesError.message);
    }, [propertiesError]);

    const {
       data: projects,
        isLoading:projectLoding,
    } = useNewProjectForMaps();

    const handleSelect = (key) => {
        if (key === "SellList") {
            setSearchParams({ listingType: "SELL" });
        } else if (key === "RentList") {
            setSearchParams({ listingType: "RENT" });
        } else if (key === "AreaList") {
            setSearchParams({});
        }
        else if (key === "NewProject") {
            setSearchParams({});
        }
    };

    if (areasLoading) return <Spinner type="fullPage" />;

    const tabs = [
        { key: 'AreaList', label: 'AreaList' },
        { key: 'SellList', label: 'SellList' },
        { key: 'RentList', label: 'RentList' },
        { key: 'NewProject', label: 'NewProject' },
    ];
    const currentTab = activeTab || 'AreaList';

    return (
        <div>
            <div className="flex border-b mb-3">
                {tabs.map(tab => (
                    <button
                        key={tab.key}
                        className={`px-4 py-2 -mb-px border-b-2 font-medium focus:outline-none transition-all ${currentTab === tab.key ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-blue-600'}`}
                        onClick={() => handleSelect(tab.key)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div>
                {currentTab === 'AreaList' && (
                    areasLoading ? (
                        <Spinner type="fullPage" />
                    ) : (
                        <div className="sectionDiv">
                            <PlotMap addresses={areasData} />
                        </div>
                    )
                )}
                {currentTab === 'SellList' && (
                    <div className="sectionDiv">
                        {propertiesLoading ? (
                            <Spinner type="fullPage" />
                        ) : (
                            <PlotMap listingType="sell" addresses={propertiesData} />
                        )}
                    </div>
                )}
                {currentTab === 'RentList' && (
                    <div className="sectionDiv">
                        {propertiesLoading ? (
                            <Spinner type="fullPage" />
                        ) : (
                            <PlotMap listingType="rent" addresses={propertiesData} />
                        )}
                    </div>
                )}
                {currentTab === 'NewProject' && (
                    projectLoding ? (
                        <Spinner type="fullPage" />
                    ) : (
                        <div className="sectionDiv">
                            <PlotMap listingType="new" addresses={projects} />
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default BootstrapTabs;
