package com.example.api.Service;

import com.example.api.DTO.*;
import com.example.api.Entity.Major;
import com.example.api.Entity.Role;
import com.example.api.Entity.User;

//import com.example.api.Entity.User_Role;
import com.example.api.Entity.ValidToken;
import com.example.api.Exception.*;

import com.example.api.Repository.MajorRepository;
import com.example.api.Repository.RoleRepository;
import com.example.api.Repository.UserRepository;
//import com.example.api.Repository.User_RoleRepository;

import com.example.api.Repository.ValidTokenRepository;
import com.example.api.Security.JwtGenerator;
import com.example.api.Service.IService.UserService;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;

import javax.swing.text.html.Option;
import java.util.*;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private MajorRepository majorRepository;

    @Autowired
    private JwtGenerator jwtGenerator;

    @Autowired
    ValidTokenRepository validTokenRepository;

    @Override
    public List<String> getAllMarjor() {
        return userRepository.getAllMarjor();
    }

    @Override
    public List<CensorResponseDTO> findByMajorWithRole(UUID majorId) {
        return userRepository.findByMajorWithRole(majorId).stream().map(CensorResponseDTO::mapCensorToCensorDTO).toList();
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User getUserById(UUID userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        return userOptional.orElse(null);
    }

    @Override
    public User createUser(UserCreateDTO usercreateDTO) {
        User user = null;
        Optional<User> checkUser = userRepository.findUserByEmail(usercreateDTO.getEmail());
        Major major = majorRepository.findById(usercreateDTO.getMajor_id()).get();
        if(checkUser.isPresent()){
            throw new UserAlreadyExistException(usercreateDTO.getEmail() + "User already exist");
        }else {
            User user1 = new User();
            Role role =roleRepository.findByName("STUDENT").get();
            user1.setUsername(usercreateDTO.getEmail().substring(0, usercreateDTO.getEmail().indexOf("@")));
            user1.setPassword(usercreateDTO.getEmail().substring(usercreateDTO.getEmail().indexOf("ps") + 2 , usercreateDTO.getEmail().indexOf("@")));
            user1.setMajor(major);
            user1.setEmail(usercreateDTO.getEmail());
            user1.setFullname(usercreateDTO.getFullname());
            user1.setPersonId(usercreateDTO.getEmail().substring(usercreateDTO.getEmail().lastIndexOf("ps") , usercreateDTO.getEmail().indexOf("@")));
            user1.setRoles(Collections.singletonList(role));
            user = userRepository.save(user1);
        }

        return user;

    }

    @Override
    public User updateUser(UUID userId, User user) {
        User existingUser = userRepository.findById(userId).orElse(null);
        if (existingUser != null) {
            existingUser.setUsername(user.getEmail().substring(0, user.getEmail().indexOf("@")));
            if (user.getPassword() != null) {
                existingUser.setPassword(user.getEmail().substring(user.getEmail().indexOf("ps") , user.getEmail().indexOf("@")));
            }
            existingUser.setPersonId(user.getEmail().substring(user.getEmail().lastIndexOf("ps") , user.getEmail().indexOf("@")));
            if (user.getEmail() != null) {
                existingUser.setEmail(user.getEmail());
            }
            if (user.getFullname() != null) {
                existingUser.setFullname(user.getFullname());
            }
            if (user.getMajor() != null) {
                existingUser.setMajor(user.getMajor());
            }
            if (user.getAvatar() != null) {
                existingUser.setAvatar(user.getAvatar());
            }

            return userRepository.save(existingUser);
        }
        throw new UserNotFoundException("Không tìm thấy người dùng với Id: " + userId);
    }

    @Override
    public void deleteUser(UUID userId) {
        Optional<User> optionalUser = userRepository.findById(userId);

        if (optionalUser.isPresent()) {
            userRepository.deleteById(userId);
        } else {
            throw new UserNotFoundException("Không tìm thấy người dùng với Id: " + userId);
        }
    }

    @Override
    public User findByName(String name) {
        return userRepository.findByUsername(name).get();
    }


    @Override
    public Collection<Role> getUserRoles(UUID userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user != null) {
            return user.getRoles(); // Assuming there's a method in User entity to get roles
        }
        return Collections.emptyList();
    }

    @Override
    public List<User> findByMajor(String major) {
        List<User> users = userRepository.findByMajor(major);
        if (users.isEmpty()) {
            throw new UserNotFoundException("No users found with major: " + major);
        }
        return users;
    }

    public User getUserByEmail(String email) throws NotFoundException {
        Optional<User> optional = userRepository.findUserByEmail(email);

        if (optional.isPresent()) {
            return optional.get();
        } else {
            throw new NotFoundException("không tìm thấy người dùng nào");
        }
    }

    public User updateProfile(String email, UserUpdateProfileDTO userUpdateProfileDTO) throws NotFoundException, AuthException {
        Optional<User> optional = userRepository.findUserByEmail(email);

        if (optional.isPresent()) {
            User user = optional.get();
            if (userUpdateProfileDTO.getPassword() != null) {
                if (userUpdateProfileDTO.getPassword().equals(user.getPassword())) {
                    user.setPassword(userUpdateProfileDTO.getNewPassword());
                } else {
                    throw new AuthException(Map.of("password", "Mật khẩu không chính xác"));
                }
            } else {
                user.setFullname(userUpdateProfileDTO.getName());
                user.setPhone(userUpdateProfileDTO.getPhone());
                if (userUpdateProfileDTO.getAvatar() != null) user.setAvatar(userUpdateProfileDTO.getAvatar());
            }
            return userRepository.save(user);
        } else {
            throw new NotFoundException("không tìm thấy người dùng nào");
        }
    }

    public UserResponseDTO login(AuthDTO authDTO) throws AuthException {
        Optional<User> optional = userRepository.findUserByEmail(authDTO.getEmail());

        if (optional.isPresent()) {
            User user = optional.get();
            if (authDTO.getPassword().equals(user.getPassword())) {
                ValidToken validToken = ValidToken
                        .builder()
                        .user(user)
                        .token(jwtGenerator.generateToken(user.getEmail()))
                        .createAt(new Date())
                        .build();
                ValidToken savedToken = validTokenRepository.save(validToken);
                return UserResponseDTO
                        .builder()
                        .access_token("Bearer " + savedToken.getToken())
                        .user(user)
                        .build();
            } else {
                Map<String, String> mapError = new HashMap<>();
                mapError.put("password", "Password không chính xác");
                throw new AuthException(mapError);
            }
        } else {
            Map<String, String> mapError = new HashMap<>();
            mapError.put("email", "Email không chính xác");
            throw new AuthException(mapError);
        }
    }

    public User loginWithGoogle(String email) throws NotFoundException {
        Optional<User> optional = userRepository.findUserByEmail(email);

        if (optional.isPresent()) {
            return optional.get();
        } else {
            throw new NotFoundException("Người dùng không tồn tại");
        }
    }

    public void logout(String email) throws NotFoundException {
        Optional<User> userOptional = userRepository.findUserByEmail(email);

        if (userOptional.isEmpty()) {
            throw new NotFoundException("Người dùng chưa được xác thực");
        } else {
            User user = userOptional.get();
            validTokenRepository.deleteTokenByUserId(user.getId());
        }
    }
}
