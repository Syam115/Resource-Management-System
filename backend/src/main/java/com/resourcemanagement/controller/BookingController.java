package com.resourcemanagement.controller;

import com.resourcemanagement.dto.ApiResponse;
import com.resourcemanagement.dto.BookingRequest;
import com.resourcemanagement.dto.BookingResponse;
import com.resourcemanagement.model.User;
import com.resourcemanagement.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getMyBookings(@AuthenticationPrincipal User user) {
        List<BookingResponse> bookings = bookingService.getBookingsByUser(user.getId());
        return ResponseEntity.ok(ApiResponse.success(bookings));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BookingResponse>> getBookingById(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        try {
            BookingResponse booking = bookingService.getBookingById(id);
            // Check if user owns this booking or is the servicer
            if (!booking.getUserId().equals(user.getId())) {
                return ResponseEntity.badRequest().body(ApiResponse.error("Access denied"));
            }
            return ResponseEntity.ok(ApiResponse.success(booking));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse<BookingResponse>> createBooking(
            @Valid @RequestBody BookingRequest request,
            @AuthenticationPrincipal User user) {
        try {
            BookingResponse booking = bookingService.createBooking(request, user.getId());
            return ResponseEntity.ok(ApiResponse.success("Booking request submitted successfully", booking));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<BookingResponse>> cancelBooking(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        try {
            BookingResponse booking = bookingService.cancelBooking(id, user.getId());
            return ResponseEntity.ok(ApiResponse.success("Booking cancelled successfully", booking));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
