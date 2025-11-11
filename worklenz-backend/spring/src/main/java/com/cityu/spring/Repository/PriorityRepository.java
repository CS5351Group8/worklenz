package com.cityu.spring.Repository;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cityu.spring.model.Priority;
@Repository
public interface PriorityRepository extends JpaRepository<Priority, UUID> {

}
