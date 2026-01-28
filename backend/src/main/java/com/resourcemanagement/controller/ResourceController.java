package com.resourcemanagement.controller;

import com.resourcemanagement.dto.ApiResponse;
import com.resourcemanagement.dto.ResourceResponse;
import com.resourcemanagement.service.ResourceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resources")
@RequiredArgsConstructor
public class ResourceController {

    private final ResourceService resourceService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ResourceResponse>>> getAllResources(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String search) {
        List<ResourceResponse> resources;
        if (categoryId != null || search != null) {
            resources = resourceService.searchResources(categoryId, search);
        } else {
            resources = resourceService.getAvailableResources();
        }
        return ResponseEntity.ok(ApiResponse.success(resources));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ResourceResponse>> getResourceById(@PathVariable Long id) {
        try {
            ResourceResponse resource = resourceService.getResourceById(id);
            return ResponseEntity.ok(ApiResponse.success(resource));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<ApiResponse<List<ResourceResponse>>> getResourcesByCategory(@PathVariable Long categoryId) {
        List<ResourceResponse> resources = resourceService.getResourcesByCategory(categoryId);
        return ResponseEntity.ok(ApiResponse.success(resources));
    }
}
