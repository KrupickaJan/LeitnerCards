package com.krupicka.leitnercards.repository;

import com.krupicka.leitnercards.entity.TopicEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface TopicRepository extends JpaRepository<TopicEntity, UUID> {
}
