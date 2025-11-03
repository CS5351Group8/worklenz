import './project-view-updates.css';
import { Collapse, Table } from "@/shared/antd-imports";
import { CollapseProps } from "antd";
import {IProjectTask, ISprint} from "@/types/project/projectTasksViewModel.types";
import TaskListProgressCell
    from "@/pages/projects/projectView/taskList/task-list-table/task-list-table-cells/task-list-progress-cell/task-list-progress-cell";
import React from "react";
import {Tag} from "antd/es";

const ProjectViewSprints = () => {
    const mockData: ISprint[] = [
        {
            id: 1,
            project_id: 1,
            name: "mock Sprint 1",
            start_date: "2025-10-25",
            end_date: "2025-10-31",
            goal: "mock goal!",
            tasks: [{
                name: "Mock task1",
                complete_ratio: 60,
                status: "Todo",
                priority: "critical",
                manual_progress: "1",
            },{
                name: "Mock task 2 +++",
                complete_ratio: 20,
                status: "in_progress",
                priority: "high",
                manual_progress: "2",
            }]
        },
        {
            id: 2,
            project_id: 1,
            name: "mock Sprint 2",
            start_date: "2025-10-31",
            end_date: "2025-11-20",
            goal: "This is a mock goal in sprint 2!",
            tasks: [{
                name: "Mock task 2-1",
                complete_ratio: 10,
                status: "done",
                priority: "medium",
                manual_progress: "2-1",
            },{
                name: "Mock task name is 2-2 +++",
                complete_ratio: 30,
                status: "completed",
                priority: "low",
                manual_progress: "2-2",
            }]
        },
    ];

    const taskTableColumns = [
        {
            title: 'Task',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Progress',
            key: 'complete_ratio',
            render: (task: IProjectTask) => (
                <TaskListProgressCell task={task} />
            )
        },
        {
            title: 'Status',
            key: 'status',
            // @ts-ignore
            render: (task: IProjectTask) => {
                // const themeMode = useAppSelector(state => state.themeReducer.mode);
                const status = task.status?.toLowerCase() || '';
                const statusColorMap: Record<string, { light: string; dark: string }> = {
                    to_do: { light: '#7c7c7c', dark: '#434343' },
                    todo: { light: '#7c7c7c', dark: '#434343' },
                    doing: { light: '#1890ff', dark: '#177ddc' },
                    in_progress: { light: '#1890ff', dark: '#177ddc' },
                    done: { light: '#52c41a', dark: '#389e0d' },
                    completed: { light: '#52c41a', dark: '#389e0d' },
                };

                const color = statusColorMap[status]
                    ?  statusColorMap[status].light
                    : '#f0f0f0';

                const displayText = {
                    'to_do': 'To Do',
                    'todo': 'To Do',
                    'doing': 'Doing',
                    'in_progress': 'In Progress',
                    'done': 'Done',
                    'completed': 'Completed',
                }[status] || task.status;

                return <Tag color={color}>{displayText}</Tag>;
            }
        },
        {
            title: 'Priority',
            dataIndex: 'priority',
            key: 'priority',
        },
    ];

    const items: CollapseProps['items'] = mockData.map((sprint: ISprint) => ({
        key: sprint.id.toString(),
        label: <div>{sprint.name}</div>,
        children: (
            <Table
                dataSource={sprint.tasks}
                columns={taskTableColumns}
                rowKey={(record, index) => `task-${index}`}
                pagination={false}
            />
        ),
    }));

    return (
        <Collapse
            items={items}
            defaultActiveKey={[mockData[0]?.id.toString()]}
        />
    );
};

export default ProjectViewSprints;