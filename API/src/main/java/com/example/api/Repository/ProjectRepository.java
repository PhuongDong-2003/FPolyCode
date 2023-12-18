package com.example.api.Repository;

import com.example.api.Entity.Project;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProjectRepository extends JpaRepository<Project, UUID> {

    @Query("select p from Project p where p.student.id = :userId or p.censor.id =  :userId")
    List<Project> findProject(UUID userId);

    @Query("select p from Project p where p.student.id = :userId and p.status IN :status")
    List<Project> findProjectByUser(@Param("userId") UUID userId, @Param("status") List<String> status);

    @Query("select p from Project p where p.status = 'APPROVE' and p.isPublic = true")
    List<Project> findAllProject();

    @Query("select p  from Project p inner join User u on p.censor.id = u.id inner join Major m on u.major.id = m.id where (p.status = 'APPROVE' and p.title like %:keyWord% or m.name like %:keyWord%)")
    List<Project> findByKeyWord(@Param("keyWord") String keyWord);

    @Query("select p from Project p where p.censor.id = :userId and p.status IN :status")
    List<Project> findByProjectCensor(@Param("userId") UUID userId, @Param("status") List<String> status);

//    @Query("SELECT " +
//            "COUNT(*) AS PostCount " +
//            "FROM Project p " +
//            "JOIN User u ON p.censor.id = u.id " +
//            "JOIN Description d ON p.id = d.projectds.id " +
//            "WHERE YEAR(d.createDate) = YEAR(:date) AND MONTH(d.createDate) = MONTH(:date) " +
//            "GROUP BY YEAR(d.createDate), MONTH(d.createDate)")
//    Integer CountProject(@Param("date") Date date);

    @Query("SELECT p " +
            "FROM Major m " +
            "INNER JOIN User u ON u.major.id = m.id"+
            " JOIN Project p ON u.id = p.student.id " +
            "INNER JOIN Description d ON p.id = d.project.id " +
            "ORDER BY d.viewCount DESC")
    List<Project> TopProjectWithView();
}
