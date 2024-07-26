package com.krupicka.leitnercards.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class UserDto {

    private Integer id;
    @NotBlank(message = "Email is required.")
    @Size(min = 1, message = "Email is required.")
    @Email(message = "Email is not well formatted.",
            regexp = "[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,3}",
            flags = Pattern.Flag.CASE_INSENSITIVE)
    private String email;
    @NotBlank(message = "Name is required.")
    @Size(max = 40, min = 3, message = "Name size must be between 3 and 40 characters")
    private String name;
    @NotBlank(message = "Password is required.")
    @Size(min = 8, message = "Password should be at least 8 characters.")
    private String password;
    private String role;
}
