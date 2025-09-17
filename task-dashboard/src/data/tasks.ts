import { type Task } from '../types/Task';

export const tasks: Task[] = [
  {
    id: '1',
    title: 'Complete Project Proposal',
    description: 'Write and submit the quarterly project proposal including budget analysis and timeline estimates.',
    completed: false,
  },
  {
    id: '2',
    title: 'Team Meeting',
    description: 'Weekly standup meeting to discuss project progress and upcoming deadlines.',
    completed: true,
  },
  {
    id: '3',
    title: 'Code Review',
    description: 'Review pull requests from team members and provide constructive feedback on implementation.',
    completed: false,
  },
  {
    id: '4',
    title: 'Update Documentation',
    description: 'Update API documentation and user guide to reflect recent changes in the application.',
    completed: true,
  },
  {
    id: '5',
    title: 'Bug Fixes',
    description: 'Investigate and fix reported bugs in the authentication module and user dashboard.',
    completed: false,
  },
  {
    id: '6',
    title: 'Deploy to Production',
    description: 'Deploy the latest version to production environment after thorough testing and approval.',
    completed: false,
  },
];