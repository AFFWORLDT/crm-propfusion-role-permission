import useBayutLeads from "../../features/bayutLeads/bayutLeadsLeads/useBayutLeads";
import Pagination from "../../ui/Pagination";
import SectionTop from "../../ui/SectionTop";
import { useEffect } from "react";
import toast from "react-hot-toast";
import Leads from "../../features/bayutLeads/bayutLeadsLeads/Leads";
import BayutCommonFilter from "../../features/bayutLeads/BayutCommonFilter";


function BayutLeadsLeads() {
    const { isLoading, data, totalSize, error } = useBayutLeads()
    useEffect(() => {
        if (error) toast.error(error.message);
    }, [error]);

    return (
        <div className="sectionContainer">
            <SectionTop heading="Integrations" />
            <section className="sectionStyles">
                <div className="sectionDiv">
                    <BayutCommonFilter />
                    <Leads data={data} isLoading={isLoading} />
                    <Pagination totalSize={totalSize} isLoading={isLoading} />

                </div>
            </section>
        </div>
    )
}

export default BayutLeadsLeads
