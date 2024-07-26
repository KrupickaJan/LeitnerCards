package com.krupicka.leitnercards.mapper;

import com.krupicka.leitnercards.dto.CardDto;
import com.krupicka.leitnercards.entity.CardEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class CardMapper {

    @Autowired
    PackMapper packMapper;

    public CardDto cardEntityToDto(CardEntity cardEntity){
        CardDto cardDto = new CardDto();
        cardDto.setAnswer(cardEntity.getAnswer());
        cardDto.setQuestion(cardEntity.getQuestion());
        cardDto.setId(cardEntity.getId());
        cardDto.setCardValue(cardEntity.getCardValue());
        cardDto.setPack(packMapper.packEntityToDto(cardEntity.getPack()));
        cardDto.setDateOfLastPractice(cardEntity.getDateOfLastPractice());

        return cardDto;
    }

    public CardEntity cardDtoToEntity(CardDto cardDto){
        CardEntity cardEntity = new CardEntity();
        cardEntity.setAnswer(cardDto.getAnswer());
        cardEntity.setQuestion(cardDto.getQuestion());
        cardEntity.setId(cardDto.getId());
        cardEntity.setCardValue(cardDto.getCardValue());
        if(cardDto.getPack() != null) {
            cardEntity.setPack(packMapper.packDtoToEntity(cardDto.getPack()));
        }
        cardEntity.setDateOfLastPractice(cardDto.getDateOfLastPractice());

        return cardEntity;
    }
}
