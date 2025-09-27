import toast from "react-hot-toast";
import useBayutWhatsappLeads from "../../features/bayutLeads/whatsappLeads/useBayutWhatsappLeads";
import SectionTop from "../../ui/SectionTop"
import { useEffect } from "react";
import BayutCommonFilter from "../../features/bayutLeads/BayutCommonFilter";
import Pagination from "../../ui/Pagination";
import BayutWhatsappLeadsTable from "../../features/bayutLeads/whatsappLeads/BayutWhatsappLeadsTable";

function BayutWhatsappLeads() {
    const { isLoading, data, totalSize, error } = useBayutWhatsappLeads()
    useEffect(() => {
        if (error) toast.error(error.message);
    }, [error])

    return (
        <div className="sectionContainer">

            <SectionTop heading={'Integrations'} />
            <section className="sectionStyles">

                <div className="sectionDiv">
                    <BayutCommonFilter />
                    <BayutWhatsappLeadsTable data={data} isLoading={isLoading} />
                    <Pagination totalSize={totalSize} isLoading={isLoading} />
                </div>
            </section>
        </div>
    )
}

export default BayutWhatsappLeads
