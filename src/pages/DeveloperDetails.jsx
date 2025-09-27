import { useParams } from "react-router-dom";
import useGetDeveloperById from "../features/developers/useGetDeveloperById";
import useInfiniteProjects from "../features/newProjects/useInfiniteProjects";
import { useRef, useCallback, useEffect, useState,  } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import TabBar from "../ui/TabBar";
import DeveloperDocuments from "./DeveloperDocuments";
import NewProjectsInteractive from "../features/newProjects/NewProjectsInteractive";
import SectionTop from "../ui/SectionTop";
import ProjectFilters from "../components/ProjectFilters";
import styles from './DeveloperDetails.module.css';

function DeveloperDetails() {
    const { developerId } = useParams();
    const { data: developer, isLoading: isDevLoading } = useGetDeveloperById(developerId);
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [handoverYear, setHandoverYear] = useState("");
    const [showFilters, setShowFilters] = useState(false);

    const {
        projects,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useInfiniteProjects({ 
        developer_id: developerId, 
        status: "POOL",
        min_price: minPrice || undefined,
        max_price: maxPrice || undefined,
        handover_year: handoverYear || undefined
    });
    const gridRef = useRef(null);
    const [activeTab, setActiveTab] = useState("projects");

    const handleResetFilters = () => {
        setMinPrice("");
        setMaxPrice("");
        setHandoverYear("");
    };

    const handleScroll = useCallback(() => {
        const grid = gridRef.current;
        if (!grid || isFetchingNextPage || !hasNextPage) return;
        if (grid.scrollHeight - grid.scrollTop - grid.clientHeight < 200) {
            fetchNextPage();
        }
    }, [fetchNextPage, isFetchingNextPage, hasNextPage]);
    useEffect(() => {
        const grid = gridRef.current;
        if (!grid) return;
        grid.addEventListener("scroll", handleScroll);
        return () => grid.removeEventListener("scroll", handleScroll);
    }, [handleScroll]);

    const tabs = [
        { id: "documents", label: "Documents" },
        { id: "projects", label: "Projects" },
        { id: "chat", label: "Chat" },
        { id: "briefing", label: "Briefing & Events" },
    ];

    return (
        <div className="sectionContainer" >
          <SectionTop heading="Developer Details" >
  
          <TabBar
                tabs={tabs}
                activeTab={activeTab}
                onTabClick={setActiveTab}
                containerStyles={{ marginBottom: 24 }}
            />
            </SectionTop>
           <section className="sectionStyles" style={{marginTop: 24}}>
         
             {isDevLoading ? (
                <div className={styles.loadingContainer}>Loading developer...</div>
            ) : developer && (
                <div className={styles.developerInfo}>
                    <img src={developer.logoUrl || '/placeholder.jpg'} alt={developer.name} className={styles.developerLogo} />
                    <div>
                        <h2 className={styles.developerName}>{developer.name}</h2>
                        {developer.description && <div className={styles.developerDescription}>{developer.description}</div>}
                    </div>
                </div>
            )}
            <div style={{marginTop: 24}}>
                {activeTab === "documents" && (
                    <div className={styles.documentsContainer}>
                        <DeveloperDocuments developerId={developerId} />
                    </div>
                )}
                {activeTab === "projects" && (
                    <section className={`${styles.projectsSection}`}>
                        <div className={styles.filtersWrapper}>
                            <button 
                                className={styles.toggleButton}
                                onClick={() => setShowFilters(!showFilters)}
                                aria-label={showFilters ? "Hide filters" : "Show filters"}
                            >
                                {showFilters ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                {showFilters ? "Hide Filters" : "Show Filters"}
                            </button>
                            {showFilters && (
                                <ProjectFilters
                                    minPrice={minPrice}
                                    setMinPrice={setMinPrice}
                                    maxPrice={maxPrice}
                                    setMaxPrice={setMaxPrice}
                                    handoverYear={handoverYear}
                                    setHandoverYear={setHandoverYear}
                                />
                            )}
                        </div>
                        <div
                          ref={gridRef}
                          className={styles.projectsGrid}
                          onScroll={handleScroll}
                        >
                          <NewProjectsInteractive
                              isLoading={isLoading}
                              data={projects}
                              isFetchingNextPage={isFetchingNextPage}
                              onResetFilters={handleResetFilters}
                          />
                        </div>
                    </section>
                )}
                {activeTab === "chat" && (
                    <div className={styles.comingSoonContainer}>
                        <div className={styles.comingSoonCard}>
                          🚧 Chat feature coming soon...
                        </div>
                    </div>
                )}
                {activeTab === "briefing" && (
                    <div className={styles.comingSoonContainer}>
                        <div className={styles.comingSoonCard}>
                          🚧 Briefing & Events coming soon...
                        </div>
                    </div>
                )}
            </div>
           </section>
        </div>
    );
}

export default DeveloperDetails;
