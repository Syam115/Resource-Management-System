package com.resourcemanagement.service;

import com.resourcemanagement.dto.CategoryRequest;
import com.resourcemanagement.dto.CategoryResponse;
import com.resourcemanagement.model.ResourceCategory;
import com.resourcemanagement.model.User;
import com.resourcemanagement.repository.ResourceCategoryRepository;
import com.resourcemanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final ResourceCategoryRepository categoryRepository;
    private final UserRepository userRepository;

    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<CategoryResponse> getCategoriesByServicer(Long servicerId) {
        return categoryRepository.findByServicerId(servicerId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public CategoryResponse getCategoryById(Long id) {
        ResourceCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        return mapToResponse(category);
    }

    @Transactional
    public CategoryResponse createCategory(CategoryRequest request, Long servicerId) {
        User servicer = userRepository.findById(servicerId)
                .orElseThrow(() -> new RuntimeException("Servicer not found"));

        ResourceCategory category = ResourceCategory.builder()
                .name(request.getName())
                .description(request.getDescription())
                .servicer(servicer)
                .build();

        categoryRepository.save(category);
        return mapToResponse(category);
    }

    @Transactional
    public CategoryResponse updateCategory(Long id, CategoryRequest request, Long servicerId) {
        ResourceCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        if (!category.getServicer().getId().equals(servicerId)) {
            throw new RuntimeException("You can only update your own categories");
        }

        category.setName(request.getName());
        category.setDescription(request.getDescription());
        categoryRepository.save(category);

        return mapToResponse(category);
    }

    @Transactional
    public void deleteCategory(Long id, Long servicerId) {
        ResourceCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        if (!category.getServicer().getId().equals(servicerId)) {
            throw new RuntimeException("You can only delete your own categories");
        }

        categoryRepository.delete(category);
    }

    private CategoryResponse mapToResponse(ResourceCategory category) {
        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .servicerId(category.getServicer().getId())
                .servicerName(category.getServicer().getName())
                .resourceCount(category.getResources() != null ? category.getResources().size() : 0)
                .createdAt(category.getCreatedAt())
                .build();
    }
}
