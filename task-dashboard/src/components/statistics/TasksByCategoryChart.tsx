import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface BarChartData {
    name: string;
    completed: number;
    pending: number;
    color: string;
    [key: string]: any;  // Index signature para Recharts
}

interface TasksByCategoryChartProps {
    data: BarChartData[];
}

export const TasksByCategoryChart = ({ data }: TasksByCategoryChartProps) => {
    return (
        <div className='bg-slate-900 rounded-lg p-6'>
            <h2 className='text-2xl font-bold text-white mb-6'>
                Tasks by Category
            </h2>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart
                    data={data}
                    layout="vertical"  // Barras horizontales
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />

                    <XAxis
                        type="number"
                        stroke="#9CA3AF"
                        tick={{ fill: '#9CA3AF' }}
                    />

                    <YAxis
                        type="category"
                        dataKey="name"
                        stroke="#9CA3AF"
                        tick={{ fill: '#9CA3AF' }}
                        width={100}
                    />

                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#1E293B',
                            border: '1px solid #475569',
                            borderRadius: '0.5rem',
                            color: '#fff'
                        }}
                        cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
                    />

                    <Legend
                        wrapperStyle={{ color: '#fff' }}
                    />

                    <Bar
                        dataKey="completed"
                        fill="#10B981"
                        name="Completed"
                        radius={[0, 4, 4, 0]}
                    />

                    <Bar
                        dataKey="pending"
                        fill="#F59E0B"
                        name="Pending"
                        radius={[0, 4, 4, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};