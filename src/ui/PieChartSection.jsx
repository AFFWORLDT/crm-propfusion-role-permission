import {
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
} from "recharts";
import useBrowserWidth from "../hooks/useBrowserWidth";

function PieChartSection({ data }) {
    const browserWidth = useBrowserWidth();
    const isMobileView = browserWidth <= 480;

    return (
        <ResponsiveContainer width="100%" height={isMobileView ? 350 : 240}>
            <PieChart>
                <Pie
                    data={data}
                    nameKey="type"
                    dataKey="value"
                    innerRadius={85}
                    outerRadius={110}
                    cx={isMobileView ? "50%" : "45%"}
                    cy="50%"
                    paddingAngle={3}
                >
                    {data.map((entry) => (
                        <Cell
                            fill={entry.color}
                            stroke={entry.color}
                            key={entry.type}
                        />
                    ))}
                </Pie>
                <Tooltip />
                <Legend
                    verticalAlign={isMobileView ? "bottom" : "middle"}
                    align={isMobileView ? "center" : "right"}
                    width={isMobileView ? "100%" : "25%"}
                    layout={isMobileView ? "horizontal" : "vertical"}
                    iconType="circle"
                    iconSize={20}
                />
            </PieChart>
        </ResponsiveContainer>
    );
}

export default PieChartSection;