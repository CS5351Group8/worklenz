-- Add TASK_TYPE to the WL_TASK_LIST_COL_KEY enum
ALTER TYPE WL_TASK_LIST_COL_KEY ADD VALUE 'TASK_TYPE' AFTER 'STATUS';

-- Insert TASK_TYPE column for all existing projects
INSERT INTO project_task_list_cols (name, key, index, pinned, project_id, custom_column)
SELECT 
    'Type' as name,
    'TASK_TYPE' as key,
    5 as index,  -- Position after STATUS (4) and before ASSIGNEES (6)
    true as pinned,
    id as project_id,
    false as custom_column
FROM projects
WHERE id NOT IN (
    SELECT DISTINCT project_id 
    FROM project_task_list_cols 
    WHERE key = 'TASK_TYPE'
);

-- Update the index of existing columns to make room for TASK_TYPE
UPDATE project_task_list_cols 
SET index = index + 1 
WHERE key IN ('ASSIGNEES', 'LABELS', 'PHASE', 'PRIORITY', 'TIME_TRACKING', 'ESTIMATION', 'START_DATE', 'DUE_DATE', 'COMPLETED_DATE', 'CREATED_DATE', 'LAST_UPDATED', 'REPORTER')
AND index >= 5;
