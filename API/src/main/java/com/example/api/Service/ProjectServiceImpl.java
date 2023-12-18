package com.example.api.Service;

import com.example.api.Constant.StatusEnum;
import com.example.api.DTO.*;
import com.example.api.Entity.*;
import com.example.api.Exception.AppException;
import com.example.api.Exception.NotFoundException;
import com.example.api.Response.ResponseMessage;
import com.example.api.Repository.*;
import com.example.api.Response.ApiResponse;
import com.example.api.Service.IService.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ProjectServiceImpl implements ProjectService {

    @Autowired
    ProjectRepository projectRepository;
    @Autowired
    TechRepository techRepository;
    @Autowired
    DescriptionRepository descriptionRepository;
    @Autowired
    UserRepository userRepository;

    @Autowired
    FeedBackRepository feedBackRepository;

    @Override
    public ProjectDTO getProjectById(String id) {
        Project project = projectRepository.findById(UUID.fromString(id)).orElse(null);
        return ProjectDTO.MapProjectToProjectDTO(project);
    }

    @Override
    public List<ProjectDTO> getAllProjects() {
        List<Project> projects = projectRepository.findAllProject();
        return projects.stream()
                .map(ProjectDTO::MapProjectToProjectDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProjectDTO> findProjectByUser(String email, List<String> status) {
        User user = userRepository.findUserByEmail(email).orElse(null);
        List<Project> projectDTOs;
        if (status.contains("ALL")) {
            List<String> allStatus = Arrays.asList(
                    String.valueOf(StatusEnum.PENDING),
                    String.valueOf(StatusEnum.APPROVE),
                    String.valueOf(StatusEnum.DENIED)
            );
            projectDTOs = projectRepository.findProjectByUser(user.getId(), allStatus);
        } else {
            projectDTOs = projectRepository.findProjectByUser(user.getId(), status);
        }

        return projectDTOs.stream().map(ProjectDTO::MapProjectToProjectDTO).toList();
    }

    @Override
    public List<ProjectDTO> findByProject() {
        String email = null;
        List<Project> projects = new ArrayList<>();

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication.getPrincipal() instanceof UserDetails) {
            email = ((UserDetails) authentication.getPrincipal()).getUsername();
            System.out.println(email);
        } else {
            ResponseEntity.status(401).body(new ApiResponse<>("Lỗi", new ResponseMessage("Người dùng chưa được xác thực")));
        }
        if (email != null) {
            User user = userRepository.findUserByEmail(email).orElse(null);
            projects = projectRepository.findProject(user.getId());
        }
        return projects.stream()
                .map(ProjectDTO::MapProjectToProjectDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProjectDTO> findByKeyWord(String keyWord) {
        List<Project> projects = projectRepository.findByKeyWord(keyWord);
        return projects.stream()
                .map(ProjectDTO::MapProjectToProjectDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProjectDTO> findByProjectCensor(String email, List<String> status) {
        User user = userRepository.findUserByEmail(email).orElse(null);
        List<Project> projects = projectRepository.findByProjectCensor(user.getId(), status);
        return projects.stream().map(ProjectDTO::MapProjectToProjectDTO).toList();
    }

    @Override
    public void getProjectDetailsById(String projectId) {
        projectRepository.deleteById(UUID.fromString(projectId));
    }

    @Override
    public ProjectDTO createProject(ProjectRequestDTO projectRequestDTO, String email) {
        User censor = userRepository.findById(UUID.fromString(projectRequestDTO.getCensor_id())).get();
        User student = userRepository.findUserByEmail(email).get();

        Description description = Description.builder()
                .createDate(new Date())
                .github(projectRequestDTO.getGithub())
                .viewCount(0)
                .likeCount(0)
                .build();

        Project project = Project.builder()
                .title(projectRequestDTO.getTitle())
                .status(String.valueOf(StatusEnum.PENDING))
                .isPublic(true)
                .student(student)
                .censor(censor)
                .videoPath(projectRequestDTO.getVideoPath())
                .sourcePath(projectRequestDTO.getSourcePath())
                .thumbnailPath(projectRequestDTO.getThumbnailPath())
                .techs(new HashSet<>())
                .build();

        projectRequestDTO.getTechs().forEach(t -> {
            Tech tech = techRepository.findById(t.getId()).get();
            project.getTechs().add(tech);
        });

        project.setDescription(description);
        description.setProject(project);

        Project savedProject = projectRepository.save(project);

        return ProjectDTO.MapProjectToProjectDTO(savedProject);
    }

    @Override
    public ProjectDTO updateProject(UpdateProjectDTO updateProjectDTO) throws NotFoundException {
        Optional<Project> optionalProject = projectRepository.findById(updateProjectDTO.getProject_id());

        if (optionalProject.isPresent()) {
            Project project = optionalProject.get();
            if (project.getStatus().equals(String.valueOf(StatusEnum.PENDING))) {
                if (updateProjectDTO.getStatus().equals(String.valueOf(StatusEnum.APPROVE))) {
                    project.setStatus(String.valueOf(StatusEnum.APPROVE));
                    project.getDescription().setApprovalDate(new Date());
                    Project updateProject = projectRepository.save(project);
                    return ProjectDTO.MapProjectToProjectDTO(updateProject);
                } else {
                    Feedback feedback = Feedback.builder()
                            .content(updateProjectDTO.getFeedbackContent())
                            .project(project)
                            .build();

                    project.setStatus(String.valueOf(StatusEnum.DENIED));

                    feedBackRepository.save(feedback);
                    Project updateProject = projectRepository.save(project);
                    return ProjectDTO.MapProjectToProjectDTO(updateProject);
                }
            } else {
                project.setTitle(updateProjectDTO.getTitle());
                project.getDescription().setGithub(updateProjectDTO.getGithub());
                project.setIsPublic(updateProjectDTO.getIsPublic());
                project.setTechs(new HashSet<>());
                if (updateProjectDTO.getThumbnail() != null) {
                    project.setThumbnailPath(updateProjectDTO.getThumbnail());
                }
                if (updateProjectDTO.getSource() != null) {
                    project.setSourcePath(updateProjectDTO.getSource());
                }

                HashMap<UUID, Tech> previousTechs = new HashMap<>();
                project.getTechs().forEach(tech -> previousTechs.put(tech.getId(), tech));

                HashMap<UUID, Tech> newTechs = new HashMap<>();
                updateProjectDTO.getTechs().forEach(tech -> newTechs.put(tech.getId(), tech));

                // Lấy ra những TechProject trùng nhau, khác nhau giữ lại để xóa
                newTechs.keySet().forEach(techId -> {
                    if (previousTechs.containsKey(techId)) {
                        previousTechs.remove(techId);
                    }
                });

                newTechs.values().forEach(tech -> {
                    project.getTechs().add(tech);
                });

                // Những TechProject không trùng sẽ bị xóa
                previousTechs.values().forEach(tech -> {
                    techRepository.deleteTechProject(project.getId(), tech.getId());
                });

                Project updateProject = projectRepository.save(project);
                return ProjectDTO.MapProjectToProjectDTO(updateProject);
            }
        } else {
            throw new NotFoundException("Dự án không tồn tại");
        }
    }

    @Override
    public ProjectDTO updateIsPublic(RequestDTO requestDTO) {
        Project projectResult = null;
        Project project = projectRepository.findById(requestDTO.getId())
                .orElseThrow(() -> new AppException("Project not found with ID: " + requestDTO.getId()));
        project.setIsPublic(requestDTO.isPublic());

        projectResult = projectRepository.save(project);
        ProjectDTO projectDTO = ProjectDTO.MapProjectToProjectDTO(projectResult);
        return projectDTO;
    }

//    @Override
//    public Integer CountProject(@Param("date") Date date) {
//        return projectRepository.CountProject(date);
//        return 0;
//    }

    @Override
    public  List<ReportDTO> TopProjectWithView()
    {
        List<Project> projects = projectRepository.TopProjectWithView();
        return projects.stream()
                .map(ReportDTO::MapProjectToReportDTO)
                .collect(Collectors.toList());
    }
}
