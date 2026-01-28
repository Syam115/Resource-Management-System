package com.resourcemanagement.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ResourceRequest {
    
    @NotBlank(message = "Resource name is required")
    private String name;
    
    private String description;
    
    @NotBlank(message = "Category is required")
    private String category;
    
    private String location;
    
    private Integer capacity;
    
    private Boolean isAvailable;
}
