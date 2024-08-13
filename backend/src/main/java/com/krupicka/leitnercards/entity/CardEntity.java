package com.krupicka.leitnercards.entity;


import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "cards")
@Data
public class CardEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @OnDelete(action = OnDeleteAction.CASCADE)
    private PackEntity pack;
    private String question;
    private String answer;
    private int cardValue;
    private LocalDateTime dateOfLastPractice;
}
