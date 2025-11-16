import './project-view-updates.css';
import {Button, Collapse, DatePicker, DeleteOutlined, Form, Input, message, Modal, Table} from "@/shared/antd-imports";
import {CollapseProps} from "antd";
import {IProjectTask, ISprint} from "@/types/project/projectTasksViewModel.types";
import TaskListProgressCell
    from "@/pages/projects/projectView/taskList/task-list-table/task-list-table-cells/task-list-progress-cell/task-list-progress-cell";
import React, {useEffect, useState, useCallback} from "react";
import {Tag} from "antd/es";
import {sprintService} from "@api/sprint/sprint.api.service";
import {useParams} from "react-router-dom";

const ProjectViewSprints = () => {
    const {projectId} = useParams();
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

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
    const addSprint = useCallback(async (name:string,startDate:string,endDate:string,goal?:string,description?:string) => {
        try {
            setConfirmLoading(true);
            const result = await sprintService.addSprints(projectId??"",name,startDate,endDate,goal,description);
            console.log(result);
            setIsModalOpen(false);
            form.resetFields();
            message.success('Sprint added successfully!');
            await getSprints();
        } catch (error) {
            console.error(error);
            message.error('Failed to add sprint');
        } finally {
            setConfirmLoading(false);
        }
    }, [projectId, form, getSprints]);

    const deleteSprint = useCallback(async (sprintId: number) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this sprint?',
            content: 'This action cannot be undone.',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: async () => {
                try {
                    await sprintService.deleteSprint(sprintId);
                    message.success('Sprint deleted successfully!');
                    await getSprints();
                } catch (error) {
                    console.error(error);
                    message.error('Failed to delete sprint');
                }
            },
        });
    }, [getSprints]);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            await addSprint(values.name,values.start_date,values.end_date,values.goal,values.description);
        } catch (error) {
            console.error(error);
        }
    };

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
        extra: (
            <DeleteOutlined
                onClick={(e) => {
                    e.stopPropagation();
                    deleteSprint(sprint.id).then();
                }}
                style={{ fontSize: '16px', color: '#ff4d4f' }}
            />
        )
    }));

    return (
        <>
            <Button type="primary" onClick={showModal}>
                Add Sprint
            </Button>
            <div className={"h-4"}/>
            <Collapse
                items={items}
                defaultActiveKey={[sprints[0]?.id.toString()]}
            />
            <Modal
                title="Add New Sprint"
                open={isModalOpen}
                onOk={handleSubmit}
                onCancel={handleCancel}
                confirmLoading={confirmLoading}
                okText="Submit"
                cancelText="Cancel"
            >
                <Form
                    form={form}
                    layout="vertical"
                    name="sprintForm"
                >
                    <Form.Item
                        name="name"
                        label="Sprint Name"
                        rules={[{ required: true, message: 'Please input sprint name!' }]}
                    >
                        <Input placeholder="Enter sprint name" />
                    </Form.Item>
                    <Form.Item
                        name="start_date"
                        label="Start Date"
                        rules={[{ required: true, message: 'Please select start date!' }]}
                    >
                        <DatePicker
                            style={{ width: '100%' }}
                            placeholder="Select start date"
                        />
                    </Form.Item>
                    <Form.Item
                        name="end_date"
                        label="End Date"
                        rules={[
                            { required: true, message: 'Please select end date!' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || !getFieldValue('start_date')) {
                                        return Promise.resolve();
                                    }
                                    if (value.isBefore(getFieldValue('start_date'))) {
                                        return Promise.reject(new Error('End date cannot be earlier than start date!'));
                                    }
                                    return Promise.resolve();
                                },
                            }),
                        ]}
                    >
                        <DatePicker
                            style={{ width: '100%' }}
                            placeholder="Select end date"
                        />
                    </Form.Item>

                    <Form.Item
                        name="goal"
                        label="Sprint Goal"
                    >
                        <Input
                            placeholder="Enter sprint goal"
                        />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="Sprint Description"
                    >
                        <Input.TextArea
                            placeholder="Enter sprint goal"
                            rows={3}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default ProjectViewSprints;