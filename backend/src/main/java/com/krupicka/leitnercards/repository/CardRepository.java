package com.krupicka.leitnercards.repository;

import com.krupicka.leitnercards.entity.CardEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CardRepository extends JpaRepository<CardEntity, Integer> {
}
