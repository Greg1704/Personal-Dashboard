import StatCard from '../components/statistics/StatCard';
import {CategoryDistributionChart} from '../components/statistics/CategoryDistributionChart';
import {TasksByCategoryChart} from '../components/statistics/TasksByCategoryChart';
import {useMemo} from 'react';
import {useTaskStore} from '../stores/useTaskStore';
import {useCategoryStore} from '../stores/useCategoryStore';
import {statisticsService} from '../services/statisticsService';

export const Statistics = () => {

    const { tasks } = useTaskStore();
    const { categories } = useCategoryStore();

    // Calculo de estadísticas usando el servicio

    const stats = useMemo(() =>
        statisticsService.getTaskStatistics(tasks), 
    [tasks]);

    const categoryStats = useMemo(() =>
        statisticsService.getCategoryStatistics(tasks, categories), 
    [tasks, categories]);

    const pieChartData = useMemo(() =>
        statisticsService.getPieChartData(categoryStats),
    [categoryStats]);

    const barChartData = useMemo(() =>
        statisticsService.getBarChartData(categoryStats),
    [categoryStats]);

    return (
    <div className='p-6'>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard title="Total Tasks" value={stats.total} color="indigo" />
            <StatCard title="Completed Tasks" value={stats.completed} color="green" />
            <StatCard title="Pending Tasks" value={stats.pending} color="orange" />
            <StatCard title="Completion Rate" value={`${stats.completionRate.toFixed(2)}%`} color="blue" />
        </div>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            <CategoryDistributionChart data={pieChartData} />
            <TasksByCategoryChart data={barChartData} />
        </div>
    </div>

    )
}
