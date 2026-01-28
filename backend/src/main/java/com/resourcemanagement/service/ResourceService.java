package com.resourcemanagement.service;

import com.resourcemanagement.dto.ResourceRequest;
import com.resourcemanagement.dto.ResourceResponse;
import com.resourcemanagement.model.Resource;
import com.resourcemanagement.model.ResourceCategory;
import com.resourcemanagement.model.User;
import com.resourcemanagement.repository.ResourceCategoryRepository;
import com.resourcemanagement.repository.ResourceRepository;
import com.resourcemanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ResourceService {

    private final ResourceRepository resourceRepository;
    private final ResourceCategoryRepository categoryRepository;
    private final UserRepository userRepository;

    public List<ResourceResponse> getAllResources() {
        return resourceRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ResourceResponse> getAvailableResources() {
        return resourceRepository.findByIsAvailableTrue().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ResourceResponse> searchResources(Long categoryId, String search) {
        return resourceRepository.searchResources(categoryId, search).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ResourceResponse> getResourcesByServicer(Long servicerId) {
        return resourceRepository.findByServicerId(servicerId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ResourceResponse> getResourcesByCategory(Long categoryId) {
        return resourceRepository.findByCategoryId(categoryId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ResourceResponse getResourceById(Long id) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found"));
        return mapToResponse(resource);
    }

    @Transactional
    public ResourceResponse createResource(ResourceRequest request, Long servicerId) {
        User servicer = userRepository.findById(servicerId)
                .orElseThrow(() -> new RuntimeException("Servicer not found"));

        ResourceCategory category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        if (!category.getServicer().getId().equals(servicerId)) {
            throw new RuntimeException("You can only add resources to your own categories");
        }

        Resource resource = Resource.builder()
                .name(request.getName())
                .description(request.getDescription())
                .category(category)
                .servicer(servicer)
                .location(request.getLocation())
                .capacity(request.getCapacity())
                .isAvailable(request.getIsAvailable() != null ? request.getIsAvailable() : true)
                .build();

        resourceRepository.save(resource);
        return mapToResponse(resource);
    }

    @Transactional
    public ResourceResponse updateResource(Long id, ResourceRequest request, Long servicerId) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found"));

        if (!resource.getServicer().getId().equals(servicerId)) {
            throw new RuntimeException("You can only update your own resources");
        }

        if (request.getCategoryId() != null && !request.getCategoryId().equals(resource.getCategory().getId())) {
            ResourceCategory category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            if (!category.getServicer().getId().equals(servicerId)) {
                throw new RuntimeException("You can only use your own categories");
            }
            resource.setCategory(category);
        }

        resource.setName(request.getName());
        resource.setDescription(request.getDescription());
        resource.setLocation(request.getLocation());
        resource.setCapacity(request.getCapacity());
        if (request.getIsAvailable() != null) {
            resource.setIsAvailable(request.getIsAvailable());
        }

        resourceRepository.save(resource);
        return mapToResponse(resource);
    }

    @Transactional
    public void deleteResource(Long id, Long servicerId) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found"));

        if (!resource.getServicer().getId().equals(servicerId)) {
            throw new RuntimeException("You can only delete your own resources");
        }

        resourceRepository.delete(resource);
    }

    private ResourceResponse mapToResponse(Resource resource) {
        return ResourceResponse.builder()
                .id(resource.getId())
                .name(resource.getName())
                .description(resource.getDescription())
                .categoryId(resource.getCategory().getId())
                .categoryName(resource.getCategory().getName())
                .servicerId(resource.getServicer().getId())
                .servicerName(resource.getServicer().getName())
                .location(resource.getLocation())
                .capacity(resource.getCapacity())
                .isAvailable(resource.getIsAvailable())
                .createdAt(resource.getCreatedAt())
                .build();
    }
}
