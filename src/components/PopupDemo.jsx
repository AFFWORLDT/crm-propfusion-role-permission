import { useState } from 'react';
import { Play, Pause, Settings, BarChart3, X } from 'lucide-react';
import AutoPopup from './AutoPopup';
import AdvancedAutoPopup from './AdvancedAutoPopup';
import styles from './AutoPopup.module.css';

const PopupDemo = () => {
    const [demoMode, setDemoMode] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [interval, setInterval] = useState(5000); // 5 seconds for demo

    const startDemo = () => {
        setDemoMode(true);
    };

    const stopDemo = () => {
        setDemoMode(false);
    };

    return (
        <div className={styles.demoContainer}>
            <div className={styles.demoHeader}>
                <h2>Auto Popup Demo</h2>
                <p>Test the auto popup functionality with different intervals</p>
            </div>

            <div className={styles.demoControls}>
                <div className={styles.controlGroup}>
                    <label>Demo Interval (seconds):</label>
                    <input
                        type="number"
                        value={interval / 1000}
                        onChange={(e) => setInterval(parseInt(e.target.value) * 1000)}
                        min="2"
                        max="30"
                        disabled={demoMode}
                    />
                </div>

                <div className={styles.buttonGroup}>
                    {!demoMode ? (
                        <button 
                            onClick={startDemo}
                            className={styles.startButton}
                        >
                            <Play size={16} />
                            Start Demo
                        </button>
                    ) : (
                        <button 
                            onClick={stopDemo}
                            className={styles.stopButton}
                        >
                            <Pause size={16} />
                            Stop Demo
                        </button>
                    )}

                    <button 
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className={styles.toggleButton}
                    >
                        <Settings size={16} />
                        {showAdvanced ? 'Simple Mode' : 'Advanced Mode'}
                    </button>
                </div>
            </div>

            <div className={styles.demoInfo}>
                <h3>Features:</h3>
                <ul>
                    <li>✅ Auto popup every {interval / 1000} seconds</li>
                    <li>✅ Multiple message types (Info, Success, Warning)</li>
                    <li>✅ Action buttons with navigation</li>
                    <li>✅ Disable/enable functionality</li>
                    <li>✅ Responsive design</li>
                    <li>✅ Analytics tracking</li>
                    <li>✅ Customizable messages</li>
                    <li>✅ Settings panel</li>
                </ul>
            </div>

            {/* Demo Popup Components */}
            {demoMode && (
                <>
                    {showAdvanced ? (
                        <AdvancedAutoPopup />
                    ) : (
                        <AutoPopup />
                    )}
                </>
            )}

            <div className={styles.demoInstructions}>
                <h3>Instructions:</h3>
                <ol>
                    <li>Click "Start Demo" to begin the popup demonstration</li>
                    <li>Wait for the popup to appear automatically</li>
                    <li>Try different actions: View, Dismiss, or Disable</li>
                    <li>Switch between Simple and Advanced modes</li>
                    <li>Adjust the interval to test different timing</li>
                    <li>Click "Stop Demo" to end the demonstration</li>
                </ol>
            </div>
        </div>
    );
};

export default PopupDemo;
