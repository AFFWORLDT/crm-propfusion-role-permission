import { useSyncExternalStore } from "react";

function subscribe(callback) {
    window.addEventListener("resize", callback);
    return () => window.removeEventListener("resize", callback);
}

function useBrowserWidth() {
    const browserWidth = useSyncExternalStore(
        subscribe,
        () => window.innerWidth
    );

    return browserWidth;
}

export default useBrowserWidth;
