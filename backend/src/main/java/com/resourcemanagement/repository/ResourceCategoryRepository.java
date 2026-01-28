package com.resourcemanagement.repository;

import com.resourcemanagement.model.ResourceCategory;
import com.resourcemanagement.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResourceCategoryRepository extends JpaRepository<ResourceCategory, Long> {
    List<ResourceCategory> findByServicer(User servicer);
    List<ResourceCategory> findByServicerId(Long servicerId);
}
