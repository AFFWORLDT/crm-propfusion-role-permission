import QrCodeForm from "../../features/admin/qrcode/QrCodeForm";
import SectionTop from "../../ui/SectionTop";
import TabBar from "../../ui/TabBar";

function WaterMarkQr() {
    return (
        <div className="sectionContainer">
            <SectionTop>
                <TabBar
                    activeTab="WATERMARK-QR"
                    navigateTo={(tabId) => tabId === "WATERMARK" ? "/admin/watermark" : "/admin/watermark-qr"}
                    tabs={[
                        {   
                            id: "WATERMARK",
                            label: "Watermark",
                            bgColor: "#faf5ff",
                            fontColor: "#7e22ce",
                            path: "/admin/watermark",
                        },
                        {
                            id: "WATERMARK-QR",
                            label: "Watermark QR",
                            bgColor: "#faf5ff",
                            fontColor: "#7e22ce",
                            path: "/admin/watermark-qr",
                        },
                    ]}
                />
            </SectionTop>

            <section 
                className="sectionStyles"
                style={{
                    paddingLeft: "3rem",
                    backgroundColor: "#faf5ff",
                    height: "100vh"
                }}
            >
                <div style={{backgroundColor: "#faf5ff", boxShadow: "none"}}>
                    <QrCodeForm  />
                </div>
            </section>
        </div>
    );
}

export default WaterMarkQr;
