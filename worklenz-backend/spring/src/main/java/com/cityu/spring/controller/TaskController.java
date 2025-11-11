package com.cityu.spring.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import com.cityu.spring.Service.TaskService;
import com.cityu.spring.model.Task;
import com.cityu.spring.response.ApiResponse;
import com.cityu.spring.util.ResponseUtil;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/task2")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @GetMapping("/test")
    public String test() {
        return "接口正常";
    }

    @GetMapping("/getAllTasks")
    public ResponseEntity<ApiResponse<List<Task>>> getTasks() {
        List<Task> tasks = taskService.getAllTasks();
        return ResponseUtil.success("查询成功", tasks);
    }
//一般使用这个，返回根据优先级排序过后的所有task
    @GetMapping("/getTasksSortedByPriority")
    public ResponseEntity<ApiResponse<List<Task>>> getTasksSortedByPriority() {
        List<Task> sortedTasks = taskService.getTasksSortedByPriority();
        return ResponseUtil.success("按优先级排序查询成功", sortedTasks);
    }

    @PostMapping("/createTask")
    public ResponseEntity<ApiResponse<Task>> createTask(@RequestBody Task task) {
        taskService.createTask(task);
        return ResponseUtil.success("任务创建成功", null);
    }


    @PostMapping("/updateTask")
    public ResponseEntity<ApiResponse<Task>> updateTask(@RequestBody Task task){
        taskService.updateTask(task);
        return ResponseUtil.success("任务创建成功", null);
    }

    
    @DeleteMapping("/deleteTask/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTask(@PathVariable UUID id) {
        if (taskService.deleteTask(id)==false) {
            return ResponseUtil.failure("任务不存在", null);
        }
        return ResponseUtil.success("任务删除成功",null);
    }


    @GetMapping("/getTaskById/{id}")
    public ResponseEntity<ApiResponse<Task>> getTaskById(@PathVariable UUID id) {
        Task task = taskService.findTask(id);
        return ResponseUtil.success("任务查询成功", task);

    }

    @GetMapping("/getTasksByProject")
    public ResponseEntity<ApiResponse<List<Task>>> getTasksByProject(@RequestParam UUID projectId) {
        List<Task> tasks = taskService.getTasksByProjectId(projectId);
        return ResponseUtil.success("查询成功", tasks);
    }

    @GetMapping("/getTasksBySprint")
    public ResponseEntity<ApiResponse<List<Task>>> getTasksBySprint(@RequestParam Integer sprintId) {
        List<Task> tasks = taskService.getTasksBySprintId(sprintId);
        return ResponseUtil.success("查询成功", tasks);
    }


}

