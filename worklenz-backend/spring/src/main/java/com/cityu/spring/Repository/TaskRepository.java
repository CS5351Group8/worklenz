package com.cityu.spring.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

import com.cityu.spring.model.Task;

import java.util.List;
import java.util.UUID;

public interface TaskRepository extends JpaRepository<Task, UUID> {
    List<Task> findByProjectId(UUID projectId);
    List<Task> findBySprintId(Integer sprintId);
    
}
