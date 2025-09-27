import { useEffect } from "react";
import SectionTop from "../../ui/SectionTop";
import BayutLeadsTable from "../../features/bayutLeads/bayutLeadsPortalCall/BayutLeadsTable";
import useBayutCalls from "../../features/bayutLeads/bayutLeadsPortalCall/useBayutCall";
import toast from "react-hot-toast";
import Pagination from "../../ui/Pagination";
import BayutCommonFilter from "../../features/bayutLeads/BayutCommonFilter";

function BayutLeadPortalCalls() {
    const { isLoading, data, totalSize, error } = useBayutCalls();

    useEffect(() => {
        if (error) toast.error(error.message);
    }, [error]);

    return (
        <div className="sectionContainer">
            <SectionTop heading="Integrations" />
            <section className="sectionStyles">
                <div className="sectionDiv">
                    <BayutCommonFilter />
                    <BayutLeadsTable data={data} isLoading={isLoading} />
                    <Pagination totalSize={totalSize} isLoading={isLoading} />
                </div>
            </section>
        </div>
    );
}

export default BayutLeadPortalCalls;
