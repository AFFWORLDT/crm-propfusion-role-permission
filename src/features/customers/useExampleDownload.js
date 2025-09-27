import { useQuery } from "@tanstack/react-query";
import { downloadCustomerSample } from "../../services/apiCustomer";
import { toast } from "react-hot-toast";

function useExampleDownload() {
    const { isFetching: isDownloading, refetch: download } = useQuery({
        queryKey: ["customerSample"],
        queryFn: async () => {
            try {
                const response = await downloadCustomerSample();
                if (!response.success) {
                    throw new Error("Failed to download sample file");
                }
                return response;
            } catch (err) {
                toast.error(err.message || "Failed to download sample file");
                throw err;
            }
        },
        enabled: false, // Query won't run automatically
    });

    return { isDownloading, download };
}

export default useExampleDownload;
