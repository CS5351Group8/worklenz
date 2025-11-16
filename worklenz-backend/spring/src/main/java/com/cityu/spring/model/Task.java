package com.cityu.spring.model;
import jakarta.persistence.*;
import lombok.*;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
// lombok注解
@Data 
@NoArgsConstructor 
@AllArgsConstructor 
@Builder

@Entity
@Table(name = "tasks")
public class Task {

    @Id
    @GeneratedValue
    @Column(name = "id", nullable = false)
    private UUID id;

    @NotBlank(message = "任务名称不能为空")
    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @Column(name = "description", length = 255)
    private String description;

    @Column(name = "done", nullable = false)
    @Builder.Default
    private boolean done = false;

    @Column(name = "total_minutes", nullable = false)
    @Builder.Default
    private BigDecimal totalMinutes = BigDecimal.ZERO;

    @Column(name = "archived", nullable = false)
    @Builder.Default
    private boolean archived = false;

    @NotNull(message = "taskNo不能为空")
    @Column(name = "task_no")
    private Long taskNo;

    @Column(name = "start_date")
    private OffsetDateTime startDate;

    @Column(name = "end_date")
    private OffsetDateTime endDate;

    @NotNull(message = "优先级ID不能为空")
    @Column(name = "priority_id", nullable = false)
    private UUID priorityId;

    @NotNull(message = "projectID不能为空")
    @Column(name = "project_id", nullable = false)
    private UUID projectId;

    @NotNull(message = "reportorID不能为空")
    @Column(name = "reporter_id", nullable = false)
    private UUID reporterId;

    @Column(name = "parent_task_id")
    private UUID parentTaskId;

    @NotNull(message = "status_ID不能为空")
    @Column(name = "status_id", nullable = false)
    private UUID statusId;

    @Column(name = "completed_at")
    private OffsetDateTime completedAt;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false,updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;
//这几个order的状态，使用区
    @Column(name = "sort_order", nullable = false)
    @Builder.Default
    private Integer sortOrder = 0;

    @Column(name = "roadmap_sort_order", nullable = false)
    @Builder.Default
    private Integer roadmapSortOrder = 0;

    @Column(name = "status_sort_order", nullable = false)
    @Builder.Default
    private Integer statusSortOrder = 0;

    @Column(name = "priority_sort_order", nullable = false)
    @Builder.Default
    private Integer prioritySortOrder = 0;

    @Column(name = "phase_sort_order", nullable = false)
    @Builder.Default
    private Integer phaseSortOrder = 0;

    @Column(name = "billable")
    @Builder.Default
    private Boolean billable = true;

    @Column(name = "schedule_id")
    private UUID scheduleId;

    @Column(name = "manual_progress")
    @Builder.Default
    private Boolean manualProgress = false;

    @Column(name = "progress_value")
    private Integer progressValue;

    @Column(name = "weight")
    private Integer weight;

    @Column(name = "progress_mode", length = 255)
    @Builder.Default
    private String progressMode = "default";

    @Column(name = "chore", nullable = false)
    private boolean chore;

    @Column(name = "epic_id")
    private UUID epicId;

    @Column(name = "progress_mode_type", length = 255)
    private String progressModeType;

    @Column(name = "show_subtasks", nullable = false)
    private boolean showSubtasks;
//默认-1，表示没有分sprint
    @Column(name = "sprint_id")
    private Integer sprintId;

    @Column(name = "initial_progress")
    private Integer initialProgress;

    @Column(name = "project_sort_order")
    private Integer projectSortOrder;

    @Column(name = "task_sort_order")
    private Integer taskSortOrder;

    // Getters and setters omitted for brevity
}
