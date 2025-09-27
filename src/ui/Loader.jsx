// import styles from "./Loader.module.css";

function Loader() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
            <span className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></span>
        </div>
    );
}

export default Loader;
