package com.example.api.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserUpdateProfileDTO {
    String name;
    String phone;
    String password;
    String newPassword;
    String avatar;
}
