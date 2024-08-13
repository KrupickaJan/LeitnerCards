package com.krupicka.leitnercards.controller;

import com.krupicka.leitnercards.viewModel.UserViewModel;
import com.krupicka.leitnercards.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/auth/register")
    public ResponseEntity<UserViewModel> register(@Valid @RequestBody UserViewModel usersRegistrationRequest,
                                                  BindingResult validationResult){
        return ResponseEntity.ok(userService.register(usersRegistrationRequest, validationResult));
    }

    @PostMapping("/auth/login")
    public ResponseEntity<UserViewModel> login(@RequestBody UserViewModel usersLoginRequest){
        return ResponseEntity.ok(userService.login(usersLoginRequest));
    }

    @PostMapping("/auth/refresh")
    public ResponseEntity<UserViewModel> refreshToken(@RequestBody UserViewModel refreshTokenRequest){
        return ResponseEntity.ok(userService.refreshToken(refreshTokenRequest));
    }

    @GetMapping("/admin/get-all-users")
    public ResponseEntity<UserViewModel> getAllUsers(){
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/admin/get-user/{userId}")
    public ResponseEntity<UserViewModel> getUserById(@PathVariable UUID userId){
        return ResponseEntity.ok(userService.getUsersById(userId));
    }

    @PutMapping("/admin/update/{userId}")
    public ResponseEntity<UserViewModel> updateUser(@PathVariable UUID userId, @RequestBody UserViewModel updatedUser){
        return ResponseEntity.ok(userService.updateUser(userId, updatedUser));
    }

    @PutMapping("/user/update-profile")
    public ResponseEntity<UserViewModel> updateProfile(@Valid  @RequestBody UserViewModel updatedProfile,
                                                       BindingResult validationResult){
        return ResponseEntity.ok(userService.updateProfile(updatedProfile, validationResult));
    }

    @GetMapping("/user/get-profile")
    public ResponseEntity<UserViewModel> getMyProfile(){
        return ResponseEntity.ok(userService.getMyInfo());
    }

    @DeleteMapping("/admin/delete/{userId}")
    public ResponseEntity<UserViewModel> deleteUser(@PathVariable UUID userId){
        return ResponseEntity.ok(userService.deleteUser(userId));
    }
}
