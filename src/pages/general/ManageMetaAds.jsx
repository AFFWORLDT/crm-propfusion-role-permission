import { Plus } from "lucide-react";
import ListMetaAds from "../../features/admin/MetaAds/ListMetaAds";
import SectionTop from "../../ui/SectionTop";
import { useNavigate } from "react-router-dom";

function ManageMetaAds() {
    const navigate = useNavigate();
    return (
        <div className="sectionContainer">
            <SectionTop heading="Manage Meta Ads" />

            <section className="sectionStyles">
                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        marginBottom: "10px",
                    }}
                >
                    <button
                        className="btnSubmit"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                        }}
                        onClick={() => navigate("/meta-ads/add")}
                    >
                        <Plus size={22} />
                        <span>Add Meta Ad</span>
                    </button>
                </div>
                <ListMetaAds />
            </section>
        </div>
    );
}

export default ManageMetaAds;
