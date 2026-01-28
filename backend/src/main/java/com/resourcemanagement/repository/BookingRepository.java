package com.resourcemanagement.repository;

import com.resourcemanagement.model.Booking;
import com.resourcemanagement.model.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserId(Long userId);
    List<Booking> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Booking> findByResourceId(Long resourceId);
    List<Booking> findByStatus(BookingStatus status);
    
    @Query("SELECT b FROM Booking b WHERE b.resource.servicer.id = :servicerId ORDER BY b.createdAt DESC")
    List<Booking> findByServicerIdOrderByCreatedAtDesc(@Param("servicerId") Long servicerId);
    
    @Query("SELECT b FROM Booking b WHERE b.resource.servicer.id = :servicerId AND b.status = :status ORDER BY b.createdAt DESC")
    List<Booking> findByServicerIdAndStatus(@Param("servicerId") Long servicerId, @Param("status") BookingStatus status);
    
    @Query("SELECT b FROM Booking b WHERE b.resource.id = :resourceId " +
           "AND b.status IN ('PENDING', 'APPROVED') " +
           "AND ((b.startTime <= :endTime AND b.endTime >= :startTime))")
    List<Booking> findConflictingBookings(@Param("resourceId") Long resourceId,
                                          @Param("startTime") LocalDateTime startTime,
                                          @Param("endTime") LocalDateTime endTime);
}
