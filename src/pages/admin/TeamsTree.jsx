import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import SectionTop from "../../ui/SectionTop";
import TabBar from "../../ui/TabBar";
import { OrgChart } from "d3-org-chart";
import axios from "axios";
import { getApiUrl } from "../../utils/getApiUrl"; 


function TeamsTree() {
    const BACKEND_URL = getApiUrl();
    const router = useNavigate();
    const chartRef = useRef();
    const chart = useRef(null);
    const [isDarkMode, setIsDarkMode] = useState(false); 
    const [teamsData, setTeamsData] = useState([]);

    const zoomIn = () => {
        chart.current && chart.current.zoomIn();
    };

    const zoomOut = () => {
        chart.current && chart.current.zoomOut(); 
    };

    const resetZoom = () => {
        chart.current && chart.current.fit();
    };

   

    const expandAllNodes = () => {
        if (chart.current) {
            chart.current.expandAll();
        }
    };

    const fetchTeamsData = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/api/teams`);
            setTeamsData(response.data);
        } catch (error) {
            console.error("Error fetching teams data:", error);
        }
    };

    const flattenTeamData = (teams) => {
        let flatData = [];
        
        // Create a root node to handle multiple roots
        flatData.push({
            id: "root",
            name: "",
            parentId: null,
            imageUrl: "/images/ai.jpg"
        });
        
        const processTeam = (team) => {
            // Set parent to root for teams with no parent
            const nodeData = {
                id: team.team_id,
                name: team.name,
                parentId: team.parent_team_id || "root",
                imageUrl: team.team_leader?.avatar || "https://cvtoken.us/images/active-user.png"
            };
            
            flatData.push(nodeData);

            // Process members
            team.members?.forEach(member => {
                flatData.push({
                    id: `member-${member.id}`,
                    name: member.name,
                    parentId: team.team_id,
                    imageUrl: member.avatar || "https://cvtoken.us/images/active-user.png"
                });
            });

            // Process sub-teams
            team.sub_teams?.forEach(subTeam => {
                processTeam(subTeam);
            });
        };

        teams.forEach(team => processTeam(team));
        return flatData;
    };

    useEffect(() => {
        fetchTeamsData();
    }, []);

    useEffect(() => {
        if (!chartRef.current || !teamsData.length) return;

        const flatData = flattenTeamData(teamsData);

        chart.current = new OrgChart()
            .container(chartRef.current)
            .nodeHeight(() => 80)
            .nodeWidth(() => 140)
            .childrenMargin(() => 60)
            .compactMarginBetween(() => 35)
            .compactMarginPair(() => 50)
            .siblingsMargin(() => 25)
            .initialZoom(0.7)
            .nodeContent((d) => {
                const isRoot = d.data.id === "root";
                const imgSize = isRoot ? 60 : 50; // Bigger size for root, standard size for others
                const imgMarginTop = isRoot ? -28 : -24;
                const imgMarginLeft = isRoot ? 5 : 10;
                const nameMarginLeft = isRoot ? 75 : 70;

                return `
                    <div class="org__main" style="width:${d.width}px;height:${d.height}px;">
                        <div class="img_wrap" style="width:${imgSize}px;height:${imgSize}px;margin-top:${imgMarginTop}px;margin-left:${imgMarginLeft}px;">
                            <img class="img_box" src="${d.data.imageUrl}" />
                        </div>
                        
                        <div style="color: #000; font-size: 12px; font-weight: 600; margin-top: 10px; margin-left: ${nameMarginLeft}px;">
                            ${d.data.name.length > 20 ? d.data.name.substring(0, 20) + '..' : d.data.name}
                        </div>
                    </div>
                `;
            });

        chart.current.data(flatData).render();
        
        // Auto expand all nodes after initial render
        setTimeout(() => {
            expandAllNodes();
        }, 500);

    }, [teamsData, isDarkMode]);


    return (
        <div className="sectionContainer">
            <SectionTop>
                <TabBar
                    activeTab="TEAMS"
                    tabs={[
                        {
                            id: "TEAMS",
                            label: "Teams Tree",
                            bgColor: "#e8f6ff",
                            fontColor: "#0369a1",
                            path: "/admin/teams-tree",
                        },
                    ]}
                />
            </SectionTop>

            <section className="sectionStyles" style={{
                paddingTop: "2rem",
                marginTop: "6rem",
                backgroundColor: "#f5f5f5",
                minHeight: "100vh",
                overflow: "auto"
            }}>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <div className="d-flex justify-content-center mb-4">
                                <div className="d-flex gap-3">
                                    <button type="button" className="btn btn-outline-success btn-lg" onClick={zoomIn}>
                                        <i className="bi bi-zoom-in"></i> Zoom In
                                    </button>
                                    <button type="button" className="btn btn-outline-success btn-lg" onClick={zoomOut}>
                                        <i className="bi bi-zoom-out"></i> Zoom Out
                                    </button>
                                    <button type="button" className="btn btn-outline-success btn-lg" onClick={resetZoom}>
                                        <i className="bi bi-arrows-fullscreen"></i> Rescale
                                    </button>
                                    <button type="button" className="btn btn-outline-primary btn-lg" onClick={expandAllNodes}>
                                        <i className="bi bi-diagram-3"></i> Expand All
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{overflow: "hidden"}}>
                        <div ref={chartRef} className="chart-container"></div>
                    </div>
                </div>
            </section>

            <style>{`
                .chart-container {
                    width: 100%;
                    height: 800px;
                    overflow: hidden;
                    background: #ffffff;
                    border: 2px solid rgba(0, 0, 0, 0.1);
                }
                
                .org__main {
                    font-family: "Montserrat", sans-serif;
                    background-color: #f0f0f0;
                    position: absolute;
                    margin-top: -1px;
                    margin-left: -1px;
                    border-radius: 10px;
                    border: 1px solid #4CAF50;
                    cursor: pointer;
                    z-index: 1;
                }

                .img_wrap {
                    background-color: #f0f0f0;
                    position: absolute;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 3px solid transparent;
                }

                .img_box {
                    position: absolute;
                    width: 120%;
                    height: 120%;
                    object-fit: cover;
                    cursor: pointer;
                    border-radius: 50%;
                }

                .referral {
                    font-size: 16px;
                    color: #000000;
                    margin-left: 65px;
                    margin-top: 5px;
                    font-weight: 600;
                }
            `}</style>
        </div>
    );
}

export default TeamsTree;
