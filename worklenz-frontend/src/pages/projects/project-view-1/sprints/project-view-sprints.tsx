import './project-view-updates.css';
import {Collapse, Table} from "@/shared/antd-imports";
import {CollapseProps} from "antd";
import {IProjectTask, ISprint} from "@/types/project/projectTasksViewModel.types";
import TaskListProgressCell
    from "@/pages/projects/projectView/taskList/task-list-table/task-list-table-cells/task-list-progress-cell/task-list-progress-cell";
import React, {useEffect, useState, useCallback} from "react";
import {Tag} from "antd/es";
import {sprintService} from "@api/sprint/sprint.api.service";

const ProjectViewSprints = () => {
    const mockData: ISprint[] = [
        {
            id: 1,
            projectId: 1,
            name: "mock Sprint 1",
            start_date: "2025-10-25",
            end_date: "2025-10-31",
            goal: "mock goal!",
            subtask: [{
                name: "Mock task1",
                complete_ratio: 60,
                status: "Todo",
                priority: "critical",
                manual_progress: "1",
            }, {
                name: "Mock task 2 +++",
                complete_ratio: 20,
                status: "in_progress",
                priority: "high",
                manual_progress: "2",
            }]
        },
        {
            id: 2,
            projectId: 1,
            name: "mock Sprint 2",
            start_date: "2025-10-31",
            end_date: "2025-11-20",
            goal: "This is a mock goal in sprint 2!",
            subtask: [{
                name: "Mock task 2-1",
                complete_ratio: 10,
                status: "done",
                priority: "medium",
                manual_progress: "2-1",
            }, {
                name: "Mock task name is 2-2 +++",
                complete_ratio: 30,
                status: "completed",
                priority: "low",
                manual_progress: "2-2",
            }]
        },
    ];

    const [sprints, setSprints] = useState<ISprint[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const getSprints = useCallback(async () => {
        try {
            setIsLoading(true);
            const result = await sprintService.getSprints();
            if (result.records && Array.isArray(result.records)) {
                setSprints(result.records);
            } else {
                console.warn('The returned data format does not match expectations:', result.records);
                setSprints(mockData);
            }
        } catch (error) {
            console.error(error);
            setSprints(mockData);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        void getSprints();
    }, [getSprints]);

    if (isLoading) {
        return null;
    }

    if (sprints.length === 0) {
        setSprints(mockData)
    }

    const taskTableColumns = [
        {
            title: 'Task',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Progress',
            key: 'complete_ratio',
            width: 120,
            align: 'center' as const,
            className: 'progress-column',
            render: (task: IProjectTask) => (
                <TaskListProgressCell task={task}/>
            )
        },
        {
            title: 'Status',
            key: 'status',
            width: 120,
            align: 'center' as const,
            className: 'status-column',
            render: (task: IProjectTask) => {
                const status = task.status?.toLowerCase() || '';
                const statusMap: Record<string, { color: string; text: string }> = {
                    to_do: {color: '#7c7c7c', text: 'To Do'},
                    todo: {color: '#7c7c7c', text: 'To Do'},
                    doing: {color: '#1890ff', text: 'Doing'},
                    in_progress: {color: '#1890ff', text: 'In Progress'},
                    done: {color: '#52c41a', text: 'Done'},
                    completed: {color: '#52c41a', text: 'Completed'},
                };
                const statusInfo = statusMap[status] || {color: '#f0f0f0', text: task.status};
                return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
            }
        },
        {
            title: 'Priority',
            dataIndex: 'priority',
            key: 'priority',
            width: 120,
            align: 'center' as const,
            className: 'priority-column',
            render: (priority: string) => {
                const priorityLower = priority?.toLowerCase() || '';
                const priorityMap: Record<string, { color: string; text: string }> = {
                    critical: {color: '#ff4d4f', text: 'Critical'},
                    high: {color: '#fa8c16', text: 'High'},
                    medium: {color: '#1890ff', text: 'Medium'},
                    low: {color: '#52c41a', text: 'Low'},
                };
                const priorityInfo = priorityMap[priorityLower] || {
                    color: '#f0f0f0',
                    text: priority || 'Unknown'
                };
                return <Tag color={priorityInfo.color}>{priorityInfo.text}</Tag>;
            }
        }
    ];

    const items: CollapseProps['items'] = sprints.map((sprint: ISprint) => ({
        key: sprint.id.toString(),
        label: <div>{sprint.name}</div>,
        children: (
            <Table
                dataSource={sprint.subtask}
                columns={taskTableColumns}
                rowKey={(record, index) => `task-${index}`}
                pagination={false}
                className="project-sprints-table"
            />
        ),
    }));

    return (
        <Collapse
            items={items}
            defaultActiveKey={[sprints[0]?.id.toString()]}
        />
    );
};

export default ProjectViewSprints;