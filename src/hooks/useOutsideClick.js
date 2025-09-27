import { useEffect, useRef } from "react";

function useOutsideClick(action, listenCapturing = true) {
    const ref = useRef(null);

    useEffect(() => {
        function handleOutsideClick(e) {
            if (!ref.current) return;
            if (!ref.current.contains(e.target)) {
                action();
            }
        }

        document.addEventListener("click", handleOutsideClick, listenCapturing);

        return () =>
            document.removeEventListener(
                "click",
                handleOutsideClick,
                listenCapturing
            );
    }, [action, listenCapturing]);

    return ref;
}

export default useOutsideClick;
