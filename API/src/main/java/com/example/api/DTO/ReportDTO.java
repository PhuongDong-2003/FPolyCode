package com.example.api.DTO;
import com.example.api.Entity.Project;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ReportDTO {
    String projectName;
    Integer view;
    String fullName;
    String major;
    Date approvalDate;



    public static ReportDTO MapProjectToReportDTO(Project project) {

        ReportDTO reportDTO = ReportDTO.builder()
                .projectName(project.getTitle())
                .fullName(project.getStudent().getFullname())
                .major(project.getStudent().getMajor().getName())
                .approvalDate(project.getDescription().getApprovalDate())
                .view(project.getDescription().getViewCount())

                .build();

        return reportDTO;


    }
}