package com.krupicka.leitnercards.repository;

import com.krupicka.leitnercards.entity.CardEntity;
import com.krupicka.leitnercards.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface CardRepository extends JpaRepository<CardEntity, UUID> {
}
