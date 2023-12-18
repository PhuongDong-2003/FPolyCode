package com.example.api.DTO;

import com.example.api.Entity.Tech;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectRequestDTO {

    String title;
    String major_id;
    String censor_id;
    Set<Tech> techs;
    String github;
    String videoPath;
    String sourcePath;
    String thumbnailPath;
}
