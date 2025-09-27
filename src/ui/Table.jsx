import { createContext, useContext } from "react";
import styles from "./Table.module.css";

const TableContext = createContext();

function Table({ columns, rowWidth, children, transparent = false, hasShadow = true, hasBorder = true }) {
    return (
        <TableContext.Provider value={{ columns, rowWidth, transparent, hasShadow, hasBorder }}>
            <div 
                className={`${styles.table} ${transparent ? styles.transparent : ''} ${!hasShadow ? styles.noShadow : ''} ${!hasBorder ? styles.noBorder : ''}`}
            >
                {children}
            </div>
        </TableContext.Provider>
    );
}

function Header({ children }) {
    const { columns, rowWidth } = useContext(TableContext);
    return (
        <div
            className={styles.tableHeader}
            style={{ gridTemplateColumns: columns, minWidth: rowWidth }}
        >
            {children}
        </div>
    );
}

function Row({ children }) {
    const { columns, rowWidth } = useContext(TableContext);
    return (
        <div
            className={styles.tableRow}
            style={{ gridTemplateColumns: columns, minWidth: rowWidth }}
        >
            {children}
        </div>
    );
}

function Body({ data, render }) {
    if (!data?.length)
        return <p className={styles.empty}>No data to show at the moment</p>;

    return <div className={styles.tableBody}>{data.map(render)}</div>;
}

Table.Header = Header;
Table.Body = Body;
Table.Row = Row;

export default Table;
