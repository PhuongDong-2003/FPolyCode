package com.example.api.Controller;

import com.example.api.DTO.AuthDTO;
import com.example.api.DTO.OauthUserInfoDTO;
import com.example.api.DTO.TokenResponseDTO;
import com.example.api.DTO.UserResponseDTO;
import com.example.api.Entity.User;
import com.example.api.Exception.AuthException;
import com.example.api.Exception.NotFoundException;
import com.example.api.Response.ResponseMessage;
import com.example.api.Response.ApiResponse;
import com.example.api.Service.IService.UserService;
import com.example.api.Service.Oauth2Service;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.view.RedirectView;
import org.springframework.web.util.UriComponentsBuilder;

@RestController
@RequestMapping("/api")
public class AuthController {
    @Autowired
    UserService userService;

    @Autowired
    Oauth2Service oauth2Service;

    @PostMapping(value = "/login", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ApiResponse<?>> login(@RequestBody AuthDTO authDTO) {
        try {
            UserResponseDTO login = userService.login(authDTO);
            return ResponseEntity.ok(new ApiResponse<>("Đăng nhập thành công", login));
        } catch (AuthException ex) {
            return ResponseEntity.status(422).body(new ApiResponse<>("Lỗi", ex.getMapError()));
        }
    }

    @GetMapping("/oauth/google")
    public RedirectView loginWithGoogle(@RequestParam("code") String code) {
        RedirectView redirectView = new RedirectView();
        TokenResponseDTO tokenResponseDTO = oauth2Service.getTokenFromGoogle(code);
        try {
            User userInfo = oauth2Service.getUserInfoFromGoogle(tokenResponseDTO);
            redirectView.setUrl("http://localhost:3000/redirect?email=" + userInfo.getEmail() + "&password=" + userInfo.getPassword());
            return redirectView;
        } catch (NotFoundException e) {
            redirectView.setUrl("http://localhost:3000/login");
            return redirectView;
        }
    }

    @DeleteMapping(value = "/logout", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ApiResponse<?>> logout() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication.getPrincipal() instanceof UserDetails) {
            String email = ((UserDetails) authentication.getPrincipal()).getUsername();
            try {
                userService.logout(email);
                return ResponseEntity.ok(new ApiResponse<>("Đăng xuất thành công", new ResponseMessage("Đăng xuất thành công")));
            } catch (NotFoundException ex) {
                return ResponseEntity.status(401).body(new ApiResponse<>("Lỗi", new ResponseMessage(ex.getMessage())));
            }
        } else {
            return ResponseEntity.status(401).body(new ApiResponse<>("Lỗi", new ResponseMessage("Người dùng chưa được xác thực")));
        }
    }
}
