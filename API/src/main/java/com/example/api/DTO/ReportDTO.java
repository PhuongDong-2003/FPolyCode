package com.example.api.DTO;
import com.example.api.Entity.Project;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ReportDTO {
    String projectName;
    Integer view;
    String fullName;
    String major;


    public static ReportDTO MapProjectToReportDTO(Project project) {

        ReportDTO reportDTO = ReportDTO.builder()
                .projectName(project.getTitle())
                .fullName(project.getStudent().getUsername())
                .major(project.getStudent().getMajor().getName())
                .view(project.getDescription().getViewCount())

                .build();

        return reportDTO;


    }
}