package com.resourcemanagement.repository;

import com.resourcemanagement.model.Resource;
import com.resourcemanagement.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long> {
    List<Resource> findByServicer(User servicer);
    List<Resource> findByServicerId(Long servicerId);
    List<Resource> findByCategoryId(Long categoryId);
    List<Resource> findByIsAvailableTrue();
    
    @Query("SELECT r FROM Resource r WHERE r.isAvailable = true " +
           "AND (:categoryId IS NULL OR r.category.id = :categoryId) " +
           "AND (:search IS NULL OR LOWER(r.name) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(r.description) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<Resource> searchResources(@Param("categoryId") Long categoryId, @Param("search") String search);
}
