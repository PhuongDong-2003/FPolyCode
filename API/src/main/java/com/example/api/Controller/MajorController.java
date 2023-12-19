package com.example.api.Controller;

import com.example.api.Entity.Major;
import com.example.api.Response.ApiResponse;
import com.example.api.Response.ResponseError;
import com.example.api.Service.MajorServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:4000"})
@RestController
@RequestMapping("/api/majors")
public class MajorController {

    @Autowired
    MajorServiceImpl majorServiceImpl;

    @GetMapping
    public ResponseEntity<ApiResponse<?>> getMajors() {
        List<Major> majors = majorServiceImpl.getAll();
        if (majors != null) {
            return ResponseEntity.ok(new ApiResponse<>("Lấy danh sách chuyên ngành thành công", majors));
        } else {
            return ResponseEntity.badRequest().body(new ApiResponse<>("Lỗi", new ResponseError("Không có dữ liệu")));
        }
    }
}
