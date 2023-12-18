package com.example.api.Service;

import com.example.api.Entity.Feedback;
import com.example.api.Repository.FeedBackRepository;
import com.example.api.Service.IService.FeedBackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class FeedBackServiceImpl implements FeedBackService {

    @Autowired
    FeedBackRepository feedBackRepository;

    @Override
    public Feedback getFeedback(UUID projectId) {
        return feedBackRepository.findFeedbackByProjectId(projectId);
    }
}
