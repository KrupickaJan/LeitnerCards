package com.krupicka.leitnercards.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class CardDto {

    private UUID id;
    private PackDto pack;
    private String question;
    private String answer;
    private int cardValue;
    private LocalDateTime dateOfLastPractice;
}
