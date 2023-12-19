package com.example.api.Controller;


import com.example.api.DTO.FeedbackRequestDTO;
import com.example.api.Entity.Feedback;
import com.example.api.Response.ApiResponse;
import com.example.api.Response.ResponseError;
import com.example.api.Service.FeedBackServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:4000"})
@RestController
@RequestMapping("/api/feedbacks")
public class FeedBackController {
    @Autowired
    FeedBackServiceImpl feedBackServiceImpl;

    @GetMapping("/{projectId}")
    public ResponseEntity<ApiResponse<?>> getFeedback(@PathVariable UUID projectId) {
        Feedback feedback = feedBackServiceImpl.getFeedback(projectId);
        return ResponseEntity.ok(new ApiResponse<>("Lấy phản hồi thành công", feedback));
    }
}
