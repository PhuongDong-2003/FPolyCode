package com.example.api.DTO;

import com.example.api.Entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Collection;
import java.util.HashSet;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserCreateDTO {
    String username;
    String password;
    UUID major_id;
    String email;
    String fullname;
    Collection<Role> roles = new HashSet<>();
}
