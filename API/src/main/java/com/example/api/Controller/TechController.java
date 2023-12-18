package com.example.api.Controller;

import com.example.api.Entity.Tech;
import com.example.api.Response.ApiResponse;
import com.example.api.Response.ResponseError;
import com.example.api.Service.TechServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/techs")
public class TechController {

    @Autowired
    TechServiceImpl techServiceImpl;

    @GetMapping
    public ResponseEntity<ApiResponse<?>> GetTech() {
        List<Tech> techs = techServiceImpl.findAll();
        return ResponseEntity.ok(new ApiResponse<>("Lấy danh sách công nghệ thành công", techs));
    }
}
