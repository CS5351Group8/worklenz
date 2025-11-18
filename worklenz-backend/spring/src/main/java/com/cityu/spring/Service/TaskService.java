package com.cityu.spring.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cityu.spring.Repository.*;
import com.cityu.spring.model.*;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;
    @Autowired
    private PriorityRepository priorityRepository;

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }


    //一般直接使用这个根据优先级排序后的所有列表
    public List<Task> getTasksSortedByPriority() {
        List<Task> tasks = taskRepository.findAll();
        List<Priority> priorities = priorityRepository.findAll();
        Map<UUID, Priority> priorityMap = priorities.stream()
            .collect(Collectors.toMap(Priority::getId, Function.identity()));
        
        // 先按优先级排序
        List<Task> sortedTasks = tasks.stream()
            .sorted(Comparator.comparingInt(task -> {
                Priority p = priorityMap.get(task.getPriorityId());
                return p != null ? p.getValue() : Integer.MAX_VALUE;
            }))
            .collect(Collectors.toList());
        
        // 然后反转列表
        Collections.reverse(sortedTasks);
        
        return sortedTasks;
    }        

    public Task createTask(Task task) {
        return taskRepository.save(task);
    }
    public Task updateTask(Task task){
        return taskRepository.save(task);
    }
    public boolean deleteTask(UUID taskId){
        if (!checkTask(taskId)) {
            return false;
        }
        taskRepository.deleteById(taskId);
        return true;
    }

    public boolean checkTask(UUID taskId){
        return taskRepository.existsById(taskId);
    }
    public Task findTask(UUID taskId){
        return taskRepository.findById(taskId) .orElseThrow(() -> new RuntimeException("任务不存在"));
    }
    //空时不抛出异常
    public List<Task> getTasksByProjectId(UUID projectId) {
        List<Task> tasks = taskRepository.findByProjectId(projectId);
        return tasks;
    }

    //空时不抛出异常

    public List<Task> getTasksBySprintId(Integer sprintId) {
        return taskRepository.findBySprintId(sprintId);
    }
    
    
}

