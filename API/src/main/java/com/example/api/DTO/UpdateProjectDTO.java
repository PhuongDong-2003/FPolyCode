package com.example.api.DTO;

import com.example.api.Entity.Tech;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UpdateProjectDTO {
    UUID project_id;
    String title;
    String github;
    String feedbackContent;
    String status;
    Boolean isPublic;
    Set<Tech> techs;
    String thumbnail;
    String source;

    /*
    *   Nếu status hiện tại là pending thì vào nhánh cập nhật trạng thái
    *   Nếu status hiện tại là approve thì vào nhánh cập nhật thông tin
    *   Nếu status hiện tại là denied thì hết cứu -> chỉ còn hả năng xóa
    * */
}
