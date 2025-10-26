import {PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer} from 'recharts';

interface ChartData{
    name: string;
    value: number;
    color: string;
}

interface CategoryDistributionChartProps{
    data: ChartData[];
}

export const CategoryDistributionChart = ({data}: CategoryDistributionChartProps) => {

    const chartData = data.map(item => ({...item,}));

    return (
    <div className='bg-slate-900 rounded-lg p-6'>
        <h2 className='text-2xl font-bold text-white mb-6'>Distribution by Category</h2>
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    </div>
    )
}