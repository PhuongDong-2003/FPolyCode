package com.example.api.Service.IService;

import com.example.api.DTO.ProjectDTO;
import com.example.api.DTO.ProjectRequestDTO;
import com.example.api.DTO.RequestDTO;
import com.example.api.DTO.UpdateProjectDTO;
import com.example.api.Entity.*;
import com.example.api.Exception.NotFoundException;
import org.springframework.data.repository.query.Param;

import java.util.Date;
import java.util.List;

public interface ProjectService {


    public ProjectDTO getProjectById(String id);

    List<ProjectDTO> getAllProjects();

    public void getProjectDetailsById(String projectId);

    List<ProjectDTO> findProjectByUser(String email, List<String> status);

    List<ProjectDTO> findByProject();

    List<ProjectDTO> findByKeyWord(String keyWord);

    public ProjectDTO createProject(ProjectRequestDTO projectRequestDTO, String email);

    public ProjectDTO updateProject(UpdateProjectDTO updateProjectDTO) throws NotFoundException;

    List<ProjectDTO> findByProjectCensor(String email, List<String> status);

    ProjectDTO updateIsPublic(RequestDTO requestDTO);

    public Integer CountProject(@Param("date") Date date);

    public List<Project> TopProjectWithView();

//    public void DeleteProjectId(UUID projectID);
//
//    public FeedBack CreateFeedback( FeedBackDTO feedBackDTO);

}
