import axios from "axios";
import Cookies from "universal-cookie";
import { getApiUrl } from "../utils/getApiUrl";

export const SelectAreaOrDeveloper = async (item) => {
    const cookies = new Cookies();

    try {
        const { data } = await axios.post(
            `${getApiUrl()}/integration/copy_data`,
            null,
            {
                params: {
                    collection: item, // Query parameter
                },
                headers: {
                    Authorization: `Bearer ${cookies.get("USER").access_token}`, // Token from cookies
                    "Content-Type": "application/json", // Ensures the correct content type
                },
            }
        );
        //
        //  console.log("show data ",data)
        return data;
    } catch (error) {
        console.log("show api error ", error);
    }
};
