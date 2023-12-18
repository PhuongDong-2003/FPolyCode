package com.example.api.Repository;

import com.example.api.Entity.Tech;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;


import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
@Repository
public interface TechRepository extends JpaRepository<Tech, UUID> {
    Optional<Tech> findTechByName(String name);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM tech_project WHERE project_id = :projectId AND tech_id = :techId", nativeQuery = true)
    void deleteTechProject(@Param("projectId") UUID projectId, @Param("techId") UUID techId);
}
