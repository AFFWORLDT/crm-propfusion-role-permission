import AddTeam from "../../features/admin/teams/AddTeam";
import TeamsTable from "../../features/admin/teams/TeamsTable";
import SectionTop from "../../ui/SectionTop";
import TabBar from "../../ui/TabBar";

function Teams() {
    return (
        <div className="sectionContainer">
            <SectionTop>
                <TabBar
                    activeTab="TEAMS"
                    tabs={[
                        {
                            id: "TEAMS",
                            label: "Teams",
                            bgColor: "#f8fafc",
                            fontColor: "#4597f5",
                            path: "/admin/teams",
                        },
                    ]}
                />
            </SectionTop>

            <section
                className="sectionStyles"
                style={{
                    paddingTop: "5rem",
                    paddingLeft: "3rem",
                    backgroundColor: "#f8fafc",
                    height: "100vh",
                }}
            >
                <div style={{ backgroundColor: "#f8fafc", boxShadow: "none" }}>
                    <div
                        style={{
                            display: "flex",
                            gap: "20px",
                            justifyContent: "end",
                            marginTop: "4rem",
                            marginBottom: "2rem",
                        }}
                    >
                        <AddTeam />
                    </div>
                    <TeamsTable />
                </div>

                <div className="d-flex justify-content-end">
                    {/* <button className="btn btn-primary" onClick={() => navigate("/admin/teams-tree")}>Teams Tree</button> */}
                </div>
            </section>
        </div>
    );
}

export default Teams;
