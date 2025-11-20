import axios from 'axios';
const BASE_URL = 'http://localhost:8080';

export const sprintService = {
    addSprints: async (projectId: string,name:string,startDate:string,endDate:string,goal?:string,description?:string) => {
        const response = await axios.post(
            `${BASE_URL}/sprints/add`,
            {
                projectId: projectId,
                name: name,
                startDate: startDate,
                endDate: endDate,
                goal: goal,
                description: description
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
    deleteSprint: async (id: number) => {
    const response = await axios.delete(
        `${BASE_URL}/sprints/delete/${id}`
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