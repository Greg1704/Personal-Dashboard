import {type Category} from '../types/Category';
import {categoryColors} from '../data/categoryColors'

export const categories: Category[] = [
    {
        id: '0',
        name: 'No Category',
        color: '#64748b', // gray-500
    },
    {
        id: '1',
        name: 'Work',
        color: categoryColors[0], // blue-500
    },
    {
        id: '2',
        name: 'Personal',
        color: categoryColors[1], // purple-500
    },
    {
        id: '3',
        name: 'Urgent',
        color: categoryColors[2], // red-500
    },  
]