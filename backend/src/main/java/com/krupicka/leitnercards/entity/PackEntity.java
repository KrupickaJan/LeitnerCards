package com.krupicka.leitnercards.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.UUID;

@Entity
@Table(name = "packs")
@Data
public class PackEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String name;
    @ManyToOne
    @OnDelete(action = OnDeleteAction.CASCADE)
    private TopicEntity topic;
    private Integer session;
}
