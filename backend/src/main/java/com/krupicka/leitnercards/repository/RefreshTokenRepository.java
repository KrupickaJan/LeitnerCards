package com.krupicka.leitnercards.repository;

import com.krupicka.leitnercards.entity.RefreshTokenEntity;
import com.krupicka.leitnercards.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface RefreshTokenRepository extends JpaRepository<RefreshTokenEntity, UUID> {
    Optional<RefreshTokenEntity> findByToken(String token);
    Optional<RefreshTokenEntity> findByUserEntity(UserEntity userEntity);
    void deleteByUserEntity(UserEntity userEntity);
}
