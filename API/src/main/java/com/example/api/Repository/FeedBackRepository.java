package com.example.api.Repository;

import com.example.api.Entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface FeedBackRepository extends JpaRepository<Feedback, UUID> {

//    @Query("SELECT f FROM Feedback f WHERE f.project.id = :projectId")
    Feedback findFeedbackByProjectId(UUID projectId);
}
