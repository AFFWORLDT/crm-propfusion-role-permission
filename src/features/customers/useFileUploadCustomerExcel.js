import { useMutation } from "@tanstack/react-query";
import { uploadCustomerExcel } from "../../services/apiCustomer";

export default function useFileUploadCustomerExcel() {
    const { isPending , mutate: upload } = useMutation({
        mutationFn: ({ file, agent_id, area_id, database_name_id }) => {
            return uploadCustomerExcel(file, agent_id, area_id, database_name_id);
        },
    });

    return { isPending, upload };
}
