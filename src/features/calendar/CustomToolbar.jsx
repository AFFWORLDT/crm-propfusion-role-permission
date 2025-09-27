import CustoomStyle from './CustomToolbar.module.css'
function CustomToolbar({ date, onNavigate }) {
    const monthNames = [ 
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const years = Array.from({ length: 11 }, (v, i) => date.getFullYear() - 5 + i); // 5 years back and 5 years forward

    const handleMonthChange = (event) => {
        const selectedMonth = parseInt(event.target.value, 10);
        const newDate = new Date(date.getFullYear(), selectedMonth, 1);
        onNavigate('date', newDate); // Navigate to the selected month
    };

    const handleYearChange = (event) => {
        const selectedYear = parseInt(event.target.value, 10);
        const newDate = new Date(selectedYear, date.getMonth(), 1);
        onNavigate('date', newDate); // Navigate to the selected year
    };

    return (
        <div className={`${CustoomStyle.RbcToolbar}`}>
            <div className={`${CustoomStyle.RbcMonthSelector}`}>
                <label>Month:</label>
                <select onChange={handleMonthChange} value={date.getMonth()}>
                    {monthNames.map((month, index) => (
                        <option key={index} value={index}>
                            {month}
                        </option>
                    ))}
                </select>
            </div>

            <div className={`${CustoomStyle.RbcYearSelector}`}>
                <label>Year:</label>
                <select onChange={handleYearChange} value={date.getFullYear()}>
                    {years.map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}

export default CustomToolbar;
