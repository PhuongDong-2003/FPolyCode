package com.example.api.Service.IService;

import com.example.api.DTO.FeedbackRequestDTO;
import com.example.api.Entity.Feedback;

import java.util.UUID;

public interface FeedBackService {

    Feedback getFeedback(UUID projectId);
}
