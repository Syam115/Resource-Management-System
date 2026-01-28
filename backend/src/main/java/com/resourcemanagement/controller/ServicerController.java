package com.resourcemanagement.controller;

import com.resourcemanagement.dto.*;
import com.resourcemanagement.model.User;
import com.resourcemanagement.service.BookingService;
import com.resourcemanagement.service.ResourceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/servicer")
@RequiredArgsConstructor
public class ServicerController {

    private final ResourceService resourceService;
    private final BookingService bookingService;

    // ==================== Resource Endpoints ====================

    @GetMapping("/resources")
    public ResponseEntity<ApiResponse<List<ResourceResponse>>> getMyResources(@AuthenticationPrincipal User user) {
        List<ResourceResponse> resources = resourceService.getResourcesByServicer(user.getId());
        return ResponseEntity.ok(ApiResponse.success(resources));
    }

    @PostMapping("/resources")
    public ResponseEntity<ApiResponse<ResourceResponse>> createResource(
            @Valid @RequestBody ResourceRequest request,
            @AuthenticationPrincipal User user) {
        try {
            ResourceResponse resource = resourceService.createResource(request, user.getId());
            return ResponseEntity.ok(ApiResponse.success("Resource created successfully", resource));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/resources/{id}")
    public ResponseEntity<ApiResponse<ResourceResponse>> updateResource(
            @PathVariable Long id,
            @Valid @RequestBody ResourceRequest request,
            @AuthenticationPrincipal User user) {
        try {
            ResourceResponse resource = resourceService.updateResource(id, request, user.getId());
            return ResponseEntity.ok(ApiResponse.success("Resource updated successfully", resource));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/resources/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteResource(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        try {
            resourceService.deleteResource(id, user.getId());
            return ResponseEntity.ok(ApiResponse.success("Resource deleted successfully", null));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // ==================== Booking Management Endpoints ====================

    @GetMapping("/bookings")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getBookingRequests(
            @RequestParam(required = false, defaultValue = "false") boolean pendingOnly,
            @AuthenticationPrincipal User user) {
        List<BookingResponse> bookings;
        if (pendingOnly) {
            bookings = bookingService.getPendingBookingsByServicer(user.getId());
        } else {
            bookings = bookingService.getBookingsByServicer(user.getId());
        }
        return ResponseEntity.ok(ApiResponse.success(bookings));
    }

    @PutMapping("/bookings/{id}/approve")
    public ResponseEntity<ApiResponse<BookingResponse>> approveBooking(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        try {
            BookingResponse booking = bookingService.approveBooking(id, user.getId());
            return ResponseEntity.ok(ApiResponse.success("Booking approved successfully", booking));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/bookings/{id}/reject")
    public ResponseEntity<ApiResponse<BookingResponse>> rejectBooking(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        try {
            BookingResponse booking = bookingService.rejectBooking(id, user.getId());
            return ResponseEntity.ok(ApiResponse.success("Booking rejected successfully", booking));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
