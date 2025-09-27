import { useQueryClient,useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { sendmail } from "../../services/apiEmail";

const useSendMail = ()=>{
    const queryClient = useQueryClient();
    const {mutate:sendMail,isPending} = useMutation({
       mutationFn:sendmail,
       onSuccess:()=>{
        queryClient.invalidateQueries(['sendMail']);
        toast.success("Mail send successflly");
       },
       onError:(err)=>{toast.error(err.message)}
    })
    return {sendMail,isPending}
}
export default useSendMail