import StatCard from '../components/statistics/StatCard';
import {CategoryDistributionChart} from '../components/statistics/CategoryDistributionChart';
import {TasksByCategoryChart} from '../components/statistics/TasksByCategoryChart';
import {useMemo} from 'react';
import {statisticsService} from '../services/statisticsService';

// React Query hooks
import { useTasks } from '../hooks/useTasks';
import { useCategories } from '../hooks/useCategories';

export const Statistics = () => {
    // React Query - Fetch data
    const { data: tasks = [], isLoading: isLoadingTasks } = useTasks();
    const { data: categories = [], isLoading: isLoadingCategories } = useCategories();

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

    // Loading state
    if (isLoadingTasks || isLoadingCategories) {
        return (
            <div className='p-6 flex items-center justify-center min-h-screen'>
                <div className="text-white text-2xl">Loading statistics...</div>
            </div>
        );
    }

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
