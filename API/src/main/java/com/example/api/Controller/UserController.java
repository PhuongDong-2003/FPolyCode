package com.example.api.Controller;

import com.example.api.DTO.CensorResponseDTO;
import com.example.api.DTO.UserUpdateProfileDTO;
import com.example.api.Entity.Role;
import com.example.api.Entity.User;

import com.example.api.Exception.AuthException;
import com.example.api.Exception.NotFoundException;
import com.example.api.Exception.UserNotFoundException;
import com.example.api.Response.ApiResponse;
import com.example.api.Response.ResponseError;
import com.example.api.Response.ResponseMessage;
import com.example.api.Service.IService.RoleService;
import com.example.api.Service.IService.UserService;
import com.example.api.Service.UserServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:8080"})
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    RoleService roleService;
    @Autowired
    private UserServiceImpl userService;


    @PostMapping(consumes = MediaType.ALL_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ApiResponse<User>> createUser(@RequestBody User user) {
        return ResponseEntity.ok(new ApiResponse<User>("Tao thanh cong!", userService.createUser(user)));
    }

    @GetMapping(consumes = MediaType.ALL_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ApiResponse<List<User>>> getAllUsers() {
        return ResponseEntity.ok(new ApiResponse<List<User>>("Load User", userService.getAllUsers()));
    }

    @GetMapping(value = "/{userID}", consumes = MediaType.ALL_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ApiResponse<?>> getUserById(@PathVariable("userID") UUID userID) {
        User user = userService.getUserById(userID);
        if (user != null) {
            return ResponseEntity.ok(new ApiResponse<User>("Tim thanh cong!", user));
        }
        return ResponseEntity.badRequest().body(new ApiResponse<ResponseError>("Tìm không thành công!", new ResponseError("Không tìm thấy user với id: " + userID)));
    }


    @DeleteMapping(value = "/{userID}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ApiResponse<?>> deleteUserById(@PathVariable("userID") UUID userID) {
        try {
            userService.deleteUser(userID);
            return ResponseEntity.ok(new ApiResponse<>("Xóa người dùng thành công!", userID));
        } catch (UserNotFoundException e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<ResponseError>("Xóa không thành công!", new ResponseError("Không tìm thấy user với id: " + userID)));
        }
    }

    @PutMapping(value = "/{userID}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ApiResponse<?>> updateUser(@PathVariable("userID") UUID userID, @RequestBody User user) {
        try {
            userService.updateUser(userID, user);
            return ResponseEntity.ok(new ApiResponse<>("Update người dùng thành công!", userID));
        } catch (UserNotFoundException e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<ResponseError>("Update không thành công!", new ResponseError("Không tìm thấy user với id: " + userID)));
        }
    }

    @GetMapping("/user-roles")
    public ResponseEntity<Collection<Role>> getUserRoles(@RequestParam("userId") UUID userId) {
        Collection<Role> userRoles = userService.getUserRoles(userId);
        if (!userRoles.isEmpty()) {
            return ResponseEntity.ok(userRoles);
        } else {
            return ResponseEntity.notFound().build();
        }
    }


//    @PostMapping("/find-by-major/{major}")
//    public List<User> findByMajor(@PathVariable("major") String major) {
//        return userService.findByMajor(major);
//    }

    @GetMapping("/getAllMajor")
    public ResponseEntity<ApiResponse<?>> GetTechName() {
        List<String> marjor = userService.getAllMarjor();
        if (marjor != null) {
            return ResponseEntity.ok(new ApiResponse<List<String>>("Load dữ liệu thành công", marjor));
        } else {
            return ResponseEntity.badRequest().body(new ApiResponse<ResponseError>("Load dữ liệu thành công", new ResponseError("Không có dữ liệu ")));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<?>> getProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication.getPrincipal() instanceof UserDetails) {
            String email = ((UserDetails) authentication.getPrincipal()).getUsername();
            try {
                User user = userService.getUserByEmail(email);
                return ResponseEntity.ok(new ApiResponse<>("Lấy thông tin thành công", user));
            } catch (NotFoundException ex) {
                return ResponseEntity.status(422).body(new ApiResponse<>("Lỗi", new ResponseMessage(ex.getMessage())));
            }
        } else {
            return ResponseEntity.status(422).body(new ApiResponse<>("Lỗi", new ResponseMessage("Người dùng không tồn tại")));
        }
    }

    @GetMapping(value = {"/censors"}, consumes = MediaType.ALL_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ApiResponse<?>> findByMajor(@RequestParam("major") String majorId) {
        List<CensorResponseDTO> users = userService.findByMajorWithRole(UUID.fromString(majorId));
        return ResponseEntity.ok(new ApiResponse<>("Tìm kếm thành công", users));
    }

    @PutMapping
    public ResponseEntity<ApiResponse<?>> updateProfile(@RequestBody UserUpdateProfileDTO userUpdateProfileDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        System.out.println(userUpdateProfileDTO.getAvatar());

        if (authentication.getPrincipal() instanceof UserDetails) {
            String email = ((UserDetails) authentication.getPrincipal()).getUsername();
            try {
                User user = userService.updateProfile(email, userUpdateProfileDTO);
                return ResponseEntity.ok(new ApiResponse<>("Cập nhật thông tin thành công", user));
            } catch (NotFoundException ex) {
                return ResponseEntity.status(401).body(new ApiResponse<>("Lỗi", new ResponseMessage(ex.getMessage())));
            } catch (AuthException ex) {
                return ResponseEntity.status(422).body(new ApiResponse<>("Lỗi", ex.getMapError()));
            }
        } else {
            return ResponseEntity.status(401).body(new ApiResponse<>("Lỗi", new ResponseMessage("Người dùng không tồn tại")));
        }
    }
}
