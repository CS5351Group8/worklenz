import axios from 'axios';

const BASE_URL = 'http://localhost:8080';

export const sprintService = {
    addSprints: async (projectId: string) => {
        const response = await axios.post(
            `${BASE_URL}/sprints/add`,
            {
                projectId: projectId,
                name: "Sprint New without id",
                startDate: "2025-11-06",
                endDate: "2025-11-20",
                goal: "试着去掉id",
                description: "新增 Sprint，用于测试创建接口"
            }
        );
        return response.data;
    },
    // '4cf4375f-d0fe-4343-9e9e-a8db9b7a0325'
    setSprintToTask: async (taskId: string ) => {
        const response = await axios.put(
            `${BASE_URL}/tasks/${taskId}/sprint?sprintId=1`
        );
        return response.data;
    },

    getSprints: async (page: number = 1) => {
        const response = await axios.get(
            `${BASE_URL}/sprints/page?page=${page}`
        );
        return response.data;
    },
};