package com.krupicka.leitnercards.service;

import com.krupicka.leitnercards.dto.UserDto;
import com.krupicka.leitnercards.viewModel.UserViewModel;
import com.krupicka.leitnercards.entity.RefreshTokenEntity;
import com.krupicka.leitnercards.entity.UserEntity;
import com.krupicka.leitnercards.mapper.UserMapper;
import com.krupicka.leitnercards.repository.RefreshTokenRepository;
import com.krupicka.leitnercards.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.BindingResult;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private JWTService jwtService;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private UserMapper userMapper;
    @Autowired
    private RefreshTokenService refreshTokenService;
    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    public UserViewModel register(UserViewModel usersRegistrationRequest, BindingResult validationResult){
        UserViewModel usersRegistrationResponse = new UserViewModel();
        try{
            Optional<UserEntity> userOptional = userRepository.findByEmail(usersRegistrationRequest.getUserDto().getEmail());
            if(userOptional.isPresent()) {
                usersRegistrationResponse.setStatusCode(409);
                usersRegistrationResponse.setError("The user already exists.");
            }
            else if (validationResult.hasErrors()){
                usersRegistrationResponse.setStatusCode(500);
                StringBuffer errors = new StringBuffer();

                validationResult.getFieldErrors().forEach(error -> errors.append(error.getDefaultMessage()).append("\n"));
                usersRegistrationResponse.setError(errors.toString());
            }
            else{
                UserEntity userResult = userRepository.save(userMapper.userDtoToEntity(usersRegistrationRequest.getUserDto()));
                usersRegistrationResponse.setUserDto(userMapper.userEntityToDto(userResult));
                usersRegistrationResponse.setMessage("User saved successfully");
                usersRegistrationResponse.setStatusCode(200);
            }
        }
        catch (Exception e){
            usersRegistrationResponse.setStatusCode(500);
            usersRegistrationResponse.setError((e.getMessage()));
        }
        return usersRegistrationResponse;
    }

    public UserViewModel login(UserViewModel usersLoginRequest){
        UserViewModel usersLoginResponse = new UserViewModel();
        try{
            Authentication authentication = authenticationManager
                    .authenticate(new UsernamePasswordAuthenticationToken(usersLoginRequest.getUserDto().getEmail(), usersLoginRequest.getUserDto().getPassword()));
            var user = userRepository.findByEmail(usersLoginRequest.getUserDto().getEmail()).orElseThrow();
            var jwt = jwtService.generateToken(user);

            if(authentication.isAuthenticated()){
                RefreshTokenEntity refreshToken = refreshTokenService.createRefreshToken(user.getEmail());
                usersLoginResponse.setStatusCode(200);
                usersLoginResponse.setToken(jwt);
                usersLoginResponse.setUserDto(new UserDto());
                usersLoginResponse.getUserDto().setRole(user.getRole());
                usersLoginResponse.setRefreshToken(refreshToken.getToken());
                usersLoginResponse.setMessage("Successfully logged in");
            }
            else{
                usersLoginResponse.setStatusCode(404);
                usersLoginResponse.setMessage("User not found for login");
            }
        }
        catch (Exception e){
            usersLoginResponse.setStatusCode(500);
            usersLoginResponse.setError((e.getMessage()));
        }
        return usersLoginResponse;
    }

    public UserViewModel refreshToken(UserViewModel refreshTokenRequest){
        UserViewModel refreshTokenResponse = new UserViewModel();
        try{
            refreshTokenService.findByToken(refreshTokenRequest.getRefreshToken())
                            .map(refreshTokenService::verifyExpiration)
                                    .map(RefreshTokenEntity::getUserEntity)
                                            .map(userEntity -> {
                                                String accessToken = jwtService.generateToken(userEntity);
                                                refreshTokenResponse.setToken(accessToken);
                                                refreshTokenResponse.setStatusCode(200);
                                                return refreshTokenResponse;
                                            }).orElseThrow(() -> new RuntimeException("Refresh Token is not in DB."));
        }catch (Exception e){
            refreshTokenResponse.setStatusCode(500);
            refreshTokenResponse.setMessage(e.getMessage());
        }
        return refreshTokenResponse;
    }

    public UserViewModel getAllUsers() {
        UserViewModel getAllUsersResponse = new UserViewModel();
        try {
            List<UserEntity> result = userRepository.findAll();
            if (result.isEmpty()) {
                getAllUsersResponse.setStatusCode(404);
                getAllUsersResponse.setMessage("No users found");
            }
            else {
                List<UserDto> userDtosList = new ArrayList<>();
                result.stream().toList().forEach(userEntity ->
                        userDtosList.add(userMapper.userEntityToDto(userEntity)));
                getAllUsersResponse.setUsersList(userDtosList);
                getAllUsersResponse.setStatusCode(200);
                getAllUsersResponse.setMessage("Successful");
            }
        } catch (Exception e) {
            getAllUsersResponse.setStatusCode(500);
            getAllUsersResponse.setMessage("Error occurred: " + e.getMessage());
        }
        return getAllUsersResponse;
    }

    public UserViewModel getUsersById(UUID id) {
        UserViewModel userResponse = new UserViewModel();
        try {
            UserEntity usersById = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User Not found"));
            userResponse.setUserDto(userMapper.userEntityToDto(usersById));
            userResponse.setStatusCode(200);
            userResponse.setMessage("Users with id '" + id + "' found successfully");
        } catch (Exception e) {
            userResponse.setStatusCode(500);
            userResponse.setMessage("Error occurred: " + e.getMessage());
        }
        return userResponse;
    }

    @Transactional
    public UserViewModel deleteUser(UUID userId) {
        UserViewModel deleteUserResponse = new UserViewModel();
        try {
            Optional<UserEntity> userOptional = userRepository.findById(userId);
            if (userOptional.isEmpty()) {
                deleteUserResponse.setStatusCode(404);
                deleteUserResponse.setMessage("User not found for deletion");
            }
            else {
                refreshTokenRepository.deleteByUserEntity(userOptional.get());
                userRepository.deleteById(userId);
                deleteUserResponse.setStatusCode(200);
                deleteUserResponse.setMessage("User deleted successfully");
            }
        } catch (Exception e) {
            deleteUserResponse.setStatusCode(500);
            deleteUserResponse.setMessage("Error occurred while deleting user: " + e.getMessage());
        }
        return deleteUserResponse;
    }

    public UserViewModel updateUser(UUID userId, UserViewModel updatedUser) {
        UserViewModel updateUserResponse = new UserViewModel();
        try {
            Optional<UserEntity> userOptional = userRepository.findById(userId);
            if (userOptional.isEmpty()) {
                updateUserResponse.setStatusCode(404);
                updateUserResponse.setMessage("User not found for update");

            } else {
                UserEntity existingUser = userOptional.get();
                existingUser.setEmail(updatedUser.getUserDto().getEmail());
                existingUser.setName(updatedUser.getUserDto().getName());
                existingUser.setRole(updatedUser.getUserDto().getRole());


//                if (updatedUser.getUserDto().getPassword() != null && !updatedUser.getUserDto().getPassword().isEmpty()) {
//
//                    existingUser.setPassword(passwordEncoder.encode(updatedUser.getUserDto().getPassword()));
//                }
                UserEntity savedUser = userRepository.save(existingUser);
                updateUserResponse.setUserDto(userMapper.userEntityToDto(savedUser));
                updateUserResponse.setStatusCode(200);
                updateUserResponse.setMessage("User updated successfully");
            }
        } catch (Exception e) {
            updateUserResponse.setStatusCode(500);
            updateUserResponse.setMessage("Error occurred while updating user: " + e.getMessage());
        }
        return updateUserResponse;
    }

    public UserViewModel updateProfile(UserViewModel updatedProfile, BindingResult validationResult) {
        UserViewModel updateProfileResponse = new UserViewModel();
        try{
            String authEmail = SecurityContextHolder.getContext().getAuthentication().getName();
            Optional<UserEntity> userOptional = userRepository.findByEmail(authEmail);
            if(userOptional.isEmpty()){
                updateProfileResponse.setStatusCode(404);
                updateProfileResponse.setMessage("User not found for update");
            }
            else if (validationResult.hasErrors()){
                updateProfileResponse.setStatusCode(500);
                StringBuffer errors = new StringBuffer();

                validationResult.getFieldErrors().forEach(error -> errors.append(error.getDefaultMessage()).append("\n"));
                updateProfileResponse.setError(errors.toString());
            }
            else{
                UserEntity existingUser = userOptional.get();
                existingUser.setEmail(updatedProfile.getUserDto().getEmail());
                existingUser.setName(updatedProfile.getUserDto().getName());
                UserEntity savedProfile = userRepository.save(existingUser);
                updateProfileResponse.setUserDto(userMapper.userEntityToDto(savedProfile));
                updateProfileResponse.setStatusCode(200);
                updateProfileResponse.setMessage("User updated successfully");
            }
        }catch (Exception e){
            updateProfileResponse.setStatusCode(500);
            updateProfileResponse.setMessage("Error occurred while getting user info: " + e.getMessage());
        }
        return updateProfileResponse;
    }

    public UserViewModel getMyInfo(){
        UserViewModel getMyInfoResponse = new UserViewModel();
        try {
            String authEmail = SecurityContextHolder.getContext().getAuthentication().getName();
            Optional<UserEntity> userOptional = userRepository.findByEmail(authEmail);
            if (userOptional.isEmpty()) {
                getMyInfoResponse.setStatusCode(404);
                getMyInfoResponse.setMessage("User not found for update");
            } else {
                getMyInfoResponse.setUserDto(userMapper.userEntityToDto(userOptional.get()));
                getMyInfoResponse.setStatusCode(200);
                getMyInfoResponse.setMessage("successful");
            }
        }catch (Exception e){
            getMyInfoResponse.setStatusCode(500);
            getMyInfoResponse.setMessage("Error occurred while getting user info: " + e.getMessage());
        }
        return getMyInfoResponse;

    }
}

