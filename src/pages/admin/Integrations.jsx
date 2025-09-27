import IntegrationContainer from "../../features/admin/integrations/IntegrationContainer";
import SectionTop from "../../ui/SectionTop";

function Integrations() {
    return (
        <div className="sectionContainer">
            <SectionTop heading="Integrations" />
            <section className="sectionStyles">
                <div className="sectionDiv">
                    <IntegrationContainer />
                </div>
            </section>
        </div>
    );
}

export default Integrations;
