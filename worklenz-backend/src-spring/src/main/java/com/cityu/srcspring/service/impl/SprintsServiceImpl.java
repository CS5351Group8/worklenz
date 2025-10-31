package com.cityu.srcspring.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.cityu.srcspring.model.dto.SprintDTO;
import com.cityu.srcspring.model.entity.Projects;
import com.cityu.srcspring.model.entity.Sprints;
import com.cityu.srcspring.dao.mapper.ProjectsMapper;
import com.cityu.srcspring.dao.mapper.SprintsMapper;
import com.cityu.srcspring.service.SprintsService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class SprintsServiceImpl implements SprintsService {
    @Autowired
    private SprintsMapper sprintsMapper;
    @Autowired
    private ProjectsMapper projectsMapper;

    @Override
    public boolean delete(Integer id) {
        return sprintsMapper.deleteById(id) > 0;
    }
    @Override
    public boolean add(Sprints sprints) {
        return sprintsMapper.insert(sprints) > 0;
    }

    @Override
    public SprintDTO get(Integer id) {
        Sprints sprint = sprintsMapper.selectById(id);
        if (sprint == null) return null;

        SprintDTO dto = new SprintDTO();
        BeanUtils.copyProperties(sprint, dto);

        Projects project = projectsMapper.selectById(sprint.getProjectId());
        dto.setProjectName(project != null ? project.getName() : null);

        return dto;
    }

    @Override
    public Object page(int page, int size) {
        Page<Sprints> sprintPage = sprintsMapper.selectPage(new Page<>(page, size), null);

        List<SprintDTO> result = sprintPage.getRecords().stream().map(sprint -> {
            SprintDTO dto = new SprintDTO();
            BeanUtils.copyProperties(sprint, dto);

            Projects project = projectsMapper.selectById(sprint.getProjectId());
            dto.setProjectName(project != null ? project.getName() : null);

            return dto;
        }).collect(Collectors.toList());

        Map<String, Object> pageResult = new HashMap<>();
        pageResult.put("total", sprintPage.getTotal());
        pageResult.put("records", result);

        return pageResult;
    }


    @Override
    public boolean update(Sprints sprints) {
        return sprintsMapper.updateById(sprints) > 0;
    }

    @Override
    public List<SprintDTO> getByProjectId(UUID projectId) {
        List<Sprints> sprints = sprintsMapper.selectList(new QueryWrapper<Sprints>().eq("project_id", projectId));
        Projects project = projectsMapper.selectById(projectId);

        return sprints.stream().map(sprint -> {
            SprintDTO dto = new SprintDTO();
            BeanUtils.copyProperties(sprint, dto);
            dto.setProjectName(project != null ? project.getName() : null);
            return dto;
        }).collect(Collectors.toList());
    }
}
