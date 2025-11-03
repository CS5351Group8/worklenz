import axios from 'axios';

const BASE_URL = 'http://localhost:8080';

export const sprintService = {
    // 根据project_id查询sprints
    getSprintsByProjectId: async (projectId: string) => {
        const response = await axios.get(
            `${BASE_URL}/sprints/getByProjectId/${projectId}`
        );
        return response.data;
    },
    // 根据project_id查询sprints
    getSprints: async (page: number=1) => {
        const response = await axios.get(
            `${BASE_URL}/sprints/page?=page=${page}`
        );
        return response.data;
    },
};