import React from 'react';
import { Tag } from 'antd';
import { IProjectTask } from '@/types/project/projectTasksViewModel.types';

interface TaskTypeDisplayProps {
  task: IProjectTask;
}

const TaskTypeDisplay: React.FC<TaskTypeDisplayProps> = ({ task }) => {
  const taskType = task.task_type || 'Task';
  
  console.log('🎯 TaskTypeDisplay 渲染:', { taskId: task.id, taskType });
  
  // 根据任务类型设置不同的颜色
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Bug':
        return 'red';
      case 'Feature':
        return 'blue';
      case 'User Story':
        return 'green';
      case 'Task':
      default:
        return 'default';
    }
  };

  return (
    <div style={{ padding: '4px' }}>
      <Tag color={getTypeColor(taskType)} style={{ margin: 0 }}>
        {taskType}
      </Tag>
    </div>
  );
};

export default TaskTypeDisplay;
