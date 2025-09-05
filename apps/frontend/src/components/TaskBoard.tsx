import React, { useState, useEffect } from 'react';
import { TaskBox } from './TaskBox';
import { Task, TaskCategory } from '../types/types';
import apiClient from '@api/apiClient';
import { CreateEditTask } from './CreateEditTask';

interface TaskCategoryData {
  title: TaskCategory;
  tasks: Task[];
}

export const TaskBoard: React.FC = () => {
  const [sortedTasks, setSortedTasks] = useState<TaskCategoryData[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory | null>(
    null,
  );

  function sortTasks(data: Task[]): TaskCategoryData[] {
    const Draft = { title: TaskCategory.DRAFT, tasks: [] as Task[] };
    const ToDo = { title: TaskCategory.TODO, tasks: [] as Task[] };
    const InProgress = { title: TaskCategory.IN_PROGRESS, tasks: [] as Task[] };
    const Completed = { title: TaskCategory.COMPLETED, tasks: [] as Task[] };

    data.forEach((task: Task, index: number): void => {
      switch (task.category) {
        case TaskCategory.DRAFT:
          Draft.tasks.push(task);
          break;
        case TaskCategory.TODO:
          ToDo.tasks.push(task);
          break;
        case TaskCategory.IN_PROGRESS:
          InProgress.tasks.push(task);
          break;
        case TaskCategory.COMPLETED:
          Completed.tasks.push(task);
          break;
      }
    });

    return [Draft, ToDo, InProgress, Completed];
  }

  const fetchTasks = async () => {
    try {
      const data = await apiClient.getTasks();
      const sortedTaskData = sortTasks(data);
      setSortedTasks(sortedTaskData);
    } catch (err) {
      console.log(err);
    }
  };

  const openCreateEditTask = (taskId: number) => {
    setSelectedTaskId(taskId);
    setSelectedCategory(null); // Clear category when editing existing task
  };

  const openCreateNewTask = (category: TaskCategory) => {
    setSelectedTaskId(null);
    setSelectedCategory(category);
  };

  const cancelCreateEditTask = () => {
    setSelectedTaskId(null);
    setSelectedCategory(null);
  };

  const handleTaskSaved = () => {
    fetchTasks();
    setSelectedTaskId(null);
    setSelectedCategory(null);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="flex flex-row gap-4 p-4 items-start justify-center">
      {selectedTaskId !== null || selectedCategory !== null ? (
        <div className="w-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <CreateEditTask
            taskId={selectedTaskId || undefined}
            defaultCategory={selectedCategory || undefined}
            handleCancel={cancelCreateEditTask}
            onTaskSaved={handleTaskSaved}
            isEditing={selectedTaskId !== null}
          />
        </div>
      ) : (
        sortedTasks.map((taskCategory, index) => (
          <TaskBox
            key={index}
            title={taskCategory.title}
            tasks={taskCategory.tasks}
            onTaskDrop={fetchTasks}
            handleClick={openCreateEditTask}
            onAddCard={() => openCreateNewTask(taskCategory.title)}
          />
        ))
      )}
    </div>
  );
};
