import './project-view-updates.css';
import { Collapse, Table } from "@/shared/antd-imports";
import { CollapseProps } from "antd";
import {IProjectTask, ISprint} from "@/types/project/projectTasksViewModel.types";
import {useAuthService} from "@/hooks/useAuth";
import TaskListProgressCell
    from "@/pages/projects/projectView/taskList/task-list-table/task-list-table-cells/task-list-progress-cell/task-list-progress-cell";
import React from "react";
import StatusDropdown from "@components/task-list-common/status-dropdown/status-dropdown";

const ProjectViewSprints = () => {
    const currentSession = useAuthService().getCurrentSession();
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
                status: "to_do",
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
            render: (_, task: IProjectTask) => (
                <StatusDropdown task={task} teamId={currentSession?.team_id || ''} />
            )
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