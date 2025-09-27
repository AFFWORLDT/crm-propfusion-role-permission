import "react-datepicker/dist/react-datepicker.css";
import Filter from "../../ui/Filter";

function BayutCommonFilter() {
    return (
        <Filter>
            <Filter.InputDatePicker
                registerName="timestamp"
                placeholder="Date"
            />
           
        </Filter>
    );
}

export default BayutCommonFilter;
