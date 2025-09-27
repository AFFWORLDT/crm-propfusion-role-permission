import { useQueryClient,useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { sendcampinmail } from "../../services/apiEmail";

const useCampinMail = ()=>{
    const queryClient = useQueryClient();
    const {mutate:sendmail,isPending} = useMutation({
      mutationFn:sendcampinmail,
      onSuccess:()=>{
        queryClient.invalidateQueries(['campinmail']);
        toast.success('Email sent successfully');
      },
      onError:()=>{
        toast.error('Error sending email');
        }
    })
    return {sendmail,isPending}
}
export default useCampinMail;  // eslint-disable-line