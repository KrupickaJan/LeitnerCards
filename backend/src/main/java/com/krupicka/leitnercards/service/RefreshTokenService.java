package com.krupicka.leitnercards.service;

import com.krupicka.leitnercards.entity.RefreshTokenEntity;
import com.krupicka.leitnercards.entity.UserEntity;
import com.krupicka.leitnercards.repository.RefreshTokenRepository;
import com.krupicka.leitnercards.repository.UserRepository;
import jakarta.persistence.EntityExistsException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
public class RefreshTokenService {

    private static final long EXPIRATION_TIME = 3600 * 1000; //1 hour

    @Autowired
    RefreshTokenRepository refreshTokenRepository;

    @Autowired
    UserRepository userRepository;

    public RefreshTokenEntity createRefreshToken(String email){
        Optional<UserEntity> userOptional = userRepository.findByEmail(email);
        if(userOptional.isPresent()){
            removeCurrentRefreshTokenIfExist(userOptional.get());
            RefreshTokenEntity refreshToken = RefreshTokenEntity.builder()
                    .userEntity(userOptional.get())
                    .token(UUID.randomUUID().toString())
                    .expiryDate(Instant.now().plusMillis(EXPIRATION_TIME))
                    .build();
            return refreshTokenRepository.save(refreshToken);
        }
        else{
            throw new EntityExistsException("User entity "+ email +" not found");
        }
    }

    public Optional<RefreshTokenEntity> findByToken(String token){
        return refreshTokenRepository.findByToken(token);
    }

    public RefreshTokenEntity verifyExpiration(RefreshTokenEntity token){
        if(token.getExpiryDate().compareTo(Instant.now())<0){
            refreshTokenRepository.delete(token);
            throw new RuntimeException(token.getToken() + " Refresh token is expired. Please make a new login..!");
        }
        return token;
    }

    private void removeCurrentRefreshTokenIfExist(UserEntity user){
        Optional<RefreshTokenEntity> tokenOptional = refreshTokenRepository.findByUserEntity(user);
        tokenOptional.ifPresent(refreshTokenEntity -> refreshTokenRepository.delete(refreshTokenEntity));
    }
}
