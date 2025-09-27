import "./Loading.css";

const Loading = ({ 
    size = "large", 
    message = "Loading...", 
    showProgressBar = true,
    overlay = false 
}) => {
    return (
        <>
            {showProgressBar && (
                <div className="progress-bar-container">
                    <div className="progress-bar"></div>
                </div>
            )}
            <div className={`loading-container loading-${size} ${overlay ? 'loading-overlay' : ''}`}>
                <div className="loading-spinner">
                    {/* <div className="spinner"></div> */}
                </div>
                <p className="loading-message">{message}</p>
            </div>
        </>
    );
};

export default Loading; 