package com.example.api.DTO;

import com.example.api.Entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CensorResponseDTO {

    UUID id;
    String name;

    public static CensorResponseDTO mapCensorToCensorDTO(User user) {
        return CensorResponseDTO.builder()
                .id(user.getId())
                .name(user.getFullname())
                .build();
    }
}
