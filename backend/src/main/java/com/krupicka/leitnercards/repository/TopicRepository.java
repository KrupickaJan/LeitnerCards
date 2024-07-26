package com.krupicka.leitnercards.repository;

import com.krupicka.leitnercards.entity.TopicEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TopicRepository extends JpaRepository<TopicEntity, Integer> {
}
