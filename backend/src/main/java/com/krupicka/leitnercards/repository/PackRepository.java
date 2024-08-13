package com.krupicka.leitnercards.repository;

import com.krupicka.leitnercards.entity.PackEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface PackRepository extends JpaRepository<PackEntity, UUID> {
}
