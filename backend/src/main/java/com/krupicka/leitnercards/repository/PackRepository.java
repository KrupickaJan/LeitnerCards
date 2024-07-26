package com.krupicka.leitnercards.repository;

import com.krupicka.leitnercards.entity.PackEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PackRepository extends JpaRepository<PackEntity, Integer> {
}
