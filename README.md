# Personal-Dashboard

## Objectives
In this project, I am looking to refine my abilities on React, while learning new tools like TypeScript, TailwindCSS, and others.

## 📋 Functional Requirements (MVP)

### Task Management:
- ✅ **Create** new tasks (title, description, date, category)
- ✅ **Edit** existing tasks
- ✅ **Delete** tasks
- ✅ **Mark** as completed/pending

### Organization:
- 📂 **Filters:** All, Completed, Pending
- 🏷️ **Categories:** Work, Personal, Urgent
- 🔍 **Search** by title/description (Could implement Fuse.js)
- 📅 **Due dates**

### Views:
- 📋 **List** (current view)
- 📊 **Dashboard** with statistics (total, completed, pending)
- 📱 **Responsive** (mobile and desktop)

## 🔧 Non-Functional Requirements

### Technical:
- **TypeScript** - Strict typing throughout
- **Modular Components** - Each component in its own folder
- **Custom Hooks** - For reusable logic
- **localStorage** - Data persistence
- **React Router** - Navigation between views

### Quality:
- **Clean Code** - Easy to read and maintain
- **Performance** - Fast loading, optimized re-renders
- **Accessibility** - Keyboard navigation, ARIA labels
- **Smooth UX** - Transitions, visual feedback

## 🎨 Visual Design

### Main Components:
- `Header` - Title and statistics
- `TaskForm` - Create/edit tasks
- `TaskCard` - Individual task view
- `TaskBoard` - Task container
- `FilterBar` - Filters and search
- `Dashboard` - Statistics view

## 📊 User Flow

1. **View** task list on load
2. **Create** new task with form
3. **Filter/search** tasks
4. **Complete/edit** existing tasks
5. **View statistics** in dashboard
6. **Data persists** on page reload

## 🚀 Development Phases

- **Phase 1:** Basic TaskBoard
- **Phase 2:** Form to create tasks
- **Phase 3:** Filters and search
- **Phase 4:** Dashboard with statistics
- **Phase 5:** React Router and multiple views
- **Phase 6:** Optimizations and localStorage

## 🛠️ Tech Stack

- **React 18** with TypeScript
- **Vite** as build tool
- **TailwindCSS** for styling
- **React Router** for navigation
- **Lucide React** for icons
- **Date-fns** for date handling

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── TaskCard/
│   ├── TaskForm/
│   ├── TaskList/
│   ├── Header/
│   └── FilterBar/
├── pages/              # Page components (Next.js ready)
│   ├── Dashboard.tsx
│   ├── TaskDetail.tsx
│   └── Settings.tsx
├── hooks/              # Custom hooks
├── types/              # TypeScript interfaces
├── utils/              # Helper functions
└── data/               # Mock data and localStorage helpers
```

## 🎯 Learning Goals

- Master TypeScript with React
- Practice modern React patterns
- Learn TailwindCSS efficiently
- Prepare for Next.js transition
- Implement clean architecture
- Build responsive, accessible UIs