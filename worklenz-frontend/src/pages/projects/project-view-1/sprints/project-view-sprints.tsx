import './project-view-updates.css';
import { Collapse, Table } from "@/shared/antd-imports";
import { CollapseProps } from "antd";
import { ISprint } from "@/types/project/projectTasksViewModel.types";
import {useAuthService} from "@/hooks/useAuth";

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
                complete_ratio: 0.6,
                status: "to_do",
                priority: "critical",
                manual_progress: "1",
            },{
                name: "Mock task 2 +++",
                complete_ratio: 0.2,
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
                complete_ratio: 0.1,
                status: "done",
                priority: "medium",
                manual_progress: "2-1",
            },{
                name: "Mock task name is 2-2 +++",
                complete_ratio: 0.3,
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
            dataIndex: 'complete_ratio',
            key: 'complete_ratio',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
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
                rowKey={(record, index) => `task-${index}`} // 建议使用更稳定的 key，如任务 id（如果存在）
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