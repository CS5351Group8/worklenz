import { useEffect, useState } from 'react';
import {
  Form,
  InputNumber,
  Select,
  DatePicker,
  Switch,
  Typography,
  Button,
  ConfigProvider,
  Flex,
} from '@/shared/antd-imports';
import { useTranslation } from 'react-i18next';
import { colors } from '@/styles/colors';
import { ITaskFormViewModel, ITaskViewModel } from '@/types/tasks/task.types';
import { IProjectTask } from '@/types/project/projectTasksViewModel.types';
import { simpleDateFormat } from '@/utils/simpleDateFormat';
import { useSocket } from '@/socket/socketContext';
import { SocketEvents } from '@/shared/socket-events';
import { useAuthService } from '@/hooks/useAuth';

import NotifyMemberSelector from './notify-member-selector';
import TaskDrawerPhaseSelector from './details/task-drawer-phase-selector/task-drawer-phase-selector';
import TaskDrawerKey from './details/task-drawer-key/task-drawer-key';
import TaskDrawerLabels from './details/task-drawer-labels/task-drawer-labels';
import TaskDrawerAssigneeSelector from './details/task-drawer-assignee-selector/task-drawer-assignee-selector';
import Avatars from '@/components/avatars/avatars';
import TaskDrawerDueDate from './details/task-drawer-due-date/task-drawer-due-date';
import TaskDrawerEstimation from './details/task-drawer-estimation/task-drawer-estimation';
import TaskDrawerPrioritySelector from './details/task-drawer-priority-selector/task-drawer-priority-selector';
import TaskDrawerBillable from './details/task-drawer-billable/task-drawer-billable';
import TaskDrawerProgress from './details/task-drawer-progress/task-drawer-progress';
import { useAppSelector } from '@/hooks/useAppSelector';
import logger from '@/utils/errorLogger';
import TaskDrawerRecurringConfig from './details/task-drawer-recurring-config/task-drawer-recurring-config';
import { InlineMember } from '@/types/teamMembers/inlineMember.types';

interface TaskDetailsFormProps {
  taskFormViewModel?: ITaskFormViewModel | null;
}

// Custom wrapper that enforces stricter rules for displaying progress input
interface ConditionalProgressInputProps {
  task: ITaskViewModel;
  form: any; // Using any for the form as the exact type may be complex
}

const ConditionalProgressInput = ({ task, form }: ConditionalProgressInputProps) => {
  const { project } = useAppSelector(state => state.projectReducer);
  const hasSubTasks = task?.sub_tasks_count > 0;
  const isSubTask = !!task?.parent_task_id;

  // STRICT RULE: Never show progress input for parent tasks with subtasks
  // This is the most important check and must be done first
  if (hasSubTasks) {
    logger.debug(`Task ${task.id} has ${task.sub_tasks_count} subtasks. Hiding progress input.`);
    return null;
  }

  // Only for tasks without subtasks, determine which input to show based on project mode
  if (project?.use_time_progress) {
    // In time-based mode, show progress input ONLY for tasks without subtasks
    return (
      <TaskDrawerProgress task={{ ...task, sub_tasks_count: hasSubTasks ? 1 : 0 }} form={form} />
    );
  } else if (project?.use_manual_progress) {
    // In manual mode, show progress input ONLY for tasks without subtasks
    return (
      <TaskDrawerProgress task={{ ...task, sub_tasks_count: hasSubTasks ? 1 : 0 }} form={form} />
    );
  } else if (project?.use_weighted_progress && isSubTask) {
    // In weighted mode, show weight input for subtasks
    return (
      <TaskDrawerProgress task={{ ...task, sub_tasks_count: hasSubTasks ? 1 : 0 }} form={form} />
    );
  }

  return null;
};

const TaskDetailsForm = ({ taskFormViewModel = null }: TaskDetailsFormProps) => {
  console.log('=== TASK DETAILS FORM COMPONENT RENDERED ===');
  console.log('taskFormViewModel prop:', taskFormViewModel);
  
  const { t } = useTranslation('task-drawer/task-drawer');
  const [form] = Form.useForm();
  const { project } = useAppSelector(state => state.projectReducer);
  const { socket } = useSocket();
  const currentSession = useAuthService().getCurrentSession();

  useEffect(() => {
    console.log('=== TASK DETAILS FORM RENDERED ===');
    console.log('taskFormViewModel:', taskFormViewModel);
    
    if (!taskFormViewModel) {
      form.resetFields();
      return;
    }

    const { task } = taskFormViewModel;
    console.log('Task data:', task);
    console.log('Task type from API:', task?.task_type);
    form.setFieldsValue({
      taskId: task?.id,
      phase: task?.phase_id,
      assignees: task?.assignees,
      dueDate: task?.end_date ?? null,
      hours: task?.total_hours || 0,
      minutes: task?.total_minutes || 0,
      priority: task?.priority || 'medium',
      labels: task?.labels || [],
      billable: task?.billable || false,
      notify: [],
      progress_value: task?.progress_value || null,
      weight: task?.weight || null,
      task_type: task?.task_type || 'Task',
    });
    console.log('Form task_type set to:', task?.task_type || 'Task');
  }, [taskFormViewModel, form]);

  const priorityMenuItems = taskFormViewModel?.priorities?.map(priority => ({
    key: priority.id,
    value: priority.id,
    label: priority.name,
  }));

  const handleTaskTypeChange = (taskType: string) => {
    console.log('=== TASK TYPE CHANGE DEBUG ===');
    console.log('handleTaskTypeChange called with:', taskType);
    console.log('taskFormViewModel:', taskFormViewModel);
    console.log('task:', taskFormViewModel?.task);
    console.log('task.id:', taskFormViewModel?.task?.id);
    console.log('currentSession:', currentSession);
    console.log('socket connected:', socket?.connected);
    
    const task = taskFormViewModel?.task;
    if (!task?.id || !taskType) {
      console.log('Early return: task.id =', task?.id, 'taskType =', taskType);
      return;
    }

    console.log('Sending TASK_TYPE_CHANGE event:', {
      task_id: task.id,
      task_type: taskType,
      team_id: currentSession?.team_id,
    });

    // Update form value immediately for better UX
    form.setFieldValue('task_type', taskType);
    
    if (socket?.connected) {
      socket.emit(
        SocketEvents.TASK_TYPE_CHANGE.toString(),
        JSON.stringify({
          task_id: task.id,
          task_type: taskType,
          team_id: currentSession?.team_id,
        })
      );
      
      // Listen for the response
      socket.once(
        SocketEvents.TASK_TYPE_CHANGE.toString(),
        (data: any) => {
          console.log('Task type updated:', data);
          // Update the form value with server response
          form.setFieldValue('task_type', data.task_type);
        }
      );
    } else {
      console.log('Socket not connected, cannot send event');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      console.log('task details form values', values);
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Form: { itemMarginBottom: 8 },
        },
      }}
    >
      <Form
        form={form}
        layout="horizontal"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        initialValues={{
          priority: 'medium',
          hours: 0,
          minutes: 0,
          billable: false,
          progress_value: null,
          weight: null,
        }}
        onFinish={handleSubmit}
      >
        <TaskDrawerKey
          taskKey={taskFormViewModel?.task?.task_key || 'NEW-TASK'}
          label={t('taskInfoTab.details.task-key')}
        />
        <TaskDrawerPhaseSelector
          phases={taskFormViewModel?.phases || []}
          task={taskFormViewModel?.task as ITaskViewModel}
        />

        <Form.Item name="task_type" label="Type">
          <Select
            placeholder="Select task type"
            onChange={(value) => {
              console.log('SELECT ONCHANGE TRIGGERED:', value);
              handleTaskTypeChange(value);
            }}
            options={[
              { label: 'Task', value: 'Task' },
              { label: 'User Story', value: 'User Story' },
              { label: 'Bug', value: 'Bug' },
              { label: 'Feature', value: 'Feature' },
            ]}
          />
        </Form.Item>

        <Form.Item name="assignees" label={t('taskInfoTab.details.assignees')}>
          <Flex gap={4} align="center">
            <Avatars
              members={
                taskFormViewModel?.task?.assignee_names ||
                (taskFormViewModel?.task?.names as unknown as InlineMember[]) ||
                []
              }
            />
            <TaskDrawerAssigneeSelector
              task={(taskFormViewModel?.task as ITaskViewModel) || null}
            />
          </Flex>
        </Form.Item>

        <TaskDrawerDueDate task={taskFormViewModel?.task as ITaskViewModel} t={t} form={form} />

        <TaskDrawerEstimation t={t} task={taskFormViewModel?.task as ITaskViewModel} form={form} />

        {taskFormViewModel?.task && (
          <ConditionalProgressInput task={taskFormViewModel?.task as ITaskViewModel} form={form} />
        )}

        <Form.Item name="priority" label={t('taskInfoTab.details.priority')}>
          <TaskDrawerPrioritySelector task={taskFormViewModel?.task as ITaskViewModel} />
        </Form.Item>

        <TaskDrawerLabels task={taskFormViewModel?.task as ITaskViewModel} t={t} />

        <Form.Item name="billable" label={t('taskInfoTab.details.billable')}>
          <TaskDrawerBillable task={taskFormViewModel?.task as ITaskViewModel} />
        </Form.Item>

        <Form.Item name="recurring" label={t('taskInfoTab.details.recurring')}>
          <TaskDrawerRecurringConfig task={taskFormViewModel?.task as ITaskViewModel} />
        </Form.Item>

        <Form.Item name="notify" label={t('taskInfoTab.details.notify')}>
          <NotifyMemberSelector task={taskFormViewModel?.task as ITaskViewModel} t={t} />
        </Form.Item>
      </Form>
    </ConfigProvider>
  );
};

export default TaskDetailsForm;
