package com.krupicka.leitnercards.service;

import com.krupicka.leitnercards.viewModel.CardViewModel;
import com.krupicka.leitnercards.entity.CardEntity;
import com.krupicka.leitnercards.entity.PackEntity;
import com.krupicka.leitnercards.mapper.CardMapper;
import com.krupicka.leitnercards.repository.CardRepository;
import com.krupicka.leitnercards.repository.PackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

import static com.krupicka.leitnercards.service.AuthorizationUtils.*;

@Service
public class CardService {

    @Autowired
    CardRepository cardRepository;
    @Autowired
    PackRepository packRepository;
    @Autowired
    CardMapper cardMapper;

    @Transactional
    public CardViewModel createCard(CardViewModel cardCreateRequest){
        CardViewModel cardCreateResponse = new CardViewModel();
        try{
            Optional<PackEntity> packOptional = packRepository.findById(cardCreateRequest.getCardDto().getPack().getId());
            if(packOptional.isEmpty()){
                cardCreateResponse.setStatusCode(404);
                cardCreateResponse.setMessage("No pack found");
            }
            else if(!isUserOwnerOfPack(packOptional.get())){
                cardCreateResponse.setStatusCode(403);
                cardCreateResponse.setMessage("User is not owner of this pack");
            }
            else{
                CardEntity cardEntity = cardMapper.cardDtoToEntity(cardCreateRequest.getCardDto());
                cardEntity.setPack(packOptional.get());
                cardEntity.setDateOfLastPractice(LocalDateTime.now().minusYears(1));
                CardEntity cardResult = cardRepository.save(cardEntity);
                cardCreateResponse.setCardDto(cardMapper.cardEntityToDto(cardResult));
                cardCreateResponse.setMessage("Card created successfully");
                cardCreateResponse.setStatusCode(200);
            }
        }
        catch (Exception e){
            cardCreateResponse.setStatusCode(500);
            cardCreateResponse.setError(e.getMessage());
        }
        return cardCreateResponse;
    }

    public CardViewModel getCard(UUID cardId) {
        CardViewModel getCardResponse = new CardViewModel();

        try{
            Optional<CardEntity> cardOptional = cardRepository.findById(cardId);
            if(cardOptional.isEmpty()){
                getCardResponse.setStatusCode(404);
                getCardResponse.setMessage("No card found");
            }
            else if(!isUserOwnerOfCard(cardOptional.get())){
                getCardResponse.setStatusCode(403);
                getCardResponse.setMessage("User is not owner of this card");
            }
            else{
                getCardResponse.setCardDto(cardMapper.cardEntityToDto(cardOptional.get()));
                getCardResponse.setStatusCode(200);
                getCardResponse.setMessage("Successful");
            }
        }  catch (Exception e){
            getCardResponse.setStatusCode(500);
            getCardResponse.setMessage("Error occurred while getting card: " + e.getMessage());
        }
        return getCardResponse;
    }

    public CardViewModel getCards(UUID packId) {
        CardViewModel getCardsResponse = new CardViewModel();
        getCardsResponse.setCards(new ArrayList<>());
        try{
            Optional<PackEntity> packOptional = packRepository.findById(packId);
            if(packOptional.isEmpty()){
                getCardsResponse.setStatusCode(404);
                getCardsResponse.setMessage("No pack found");
            }
            else if(!isUserOwnerOfPack(packOptional.get())){
                getCardsResponse.setStatusCode(403);
                getCardsResponse.setMessage("User is not owner of this pack");
            }
            else{
                List<CardEntity> cardEntities = cardRepository
                        .findAll()
                        .stream()
                        .filter(card ->
                                Objects.equals(card.getPack().getId(), packId))
                        .toList();
                cardEntities.forEach(cardEntity ->
                        getCardsResponse
                                .getCards()
                                .add(cardMapper.cardEntityToDto(cardEntity)));
                getCardsResponse.setStatusCode(200);
                getCardsResponse.setMessage("Successful");
            }
        }
        catch (Exception e){
            getCardsResponse.setStatusCode(500);
            getCardsResponse.setMessage("Error occurred while getting cards: " + e.getMessage());
        }
        return getCardsResponse;
    }

    public CardViewModel getCardsFromPacks(UUID[] getCardsRequest) {
        CardViewModel getCardsResponse = new CardViewModel();
        getCardsResponse.setCards(new ArrayList<>());
        try{
            for(UUID packId : getCardsRequest) {
                Optional<PackEntity> packOptional = packRepository.findById(packId);
                if (packOptional.isEmpty()) {
                    getCardsResponse.setStatusCode(404);
                    getCardsResponse.setMessage("No pack found id:" + packId);
                } else if (!isUserOwnerOfPack(packOptional.get())) {
                    getCardsResponse.setStatusCode(403);
                    getCardsResponse.setMessage("User is not owner of this pack named: " + packOptional.get().getName());
                } else {
                    List<CardEntity> cardEntities = cardRepository
                            .findAll()
                            .stream()
                            .filter(card ->
                                    ( Objects.equals(card.getPack().getId(), packId) &&
                                            packOptional.get().getSession() >= card.getCardValue()
                                    )
                            )
                            .toList();
                    cardEntities.forEach(cardEntity -> {
                        cardEntity.setDateOfLastPractice(LocalDateTime.now());
                        getCardsResponse.getCards().add(cardMapper.cardEntityToDto(cardEntity));
                    });
                    getCardsResponse.setStatusCode(200);
                    getCardsResponse.setMessage("Successful");
                }
            }
        }
        catch (Exception e){
            getCardsResponse.setStatusCode(500);
            getCardsResponse.setMessage("Error occurred while getting cards: " + e.getMessage());
        }
        return getCardsResponse;
    }

    public CardViewModel deleteCard(UUID cardId){
        CardViewModel deleteCardResponse = new CardViewModel();
        try{
            Optional<CardEntity> cardOptional = cardRepository.findById(cardId);
            if(cardOptional.isEmpty()){
                deleteCardResponse.setStatusCode(404);
                deleteCardResponse.setMessage("No card found");
            }
            else if(!isUserOwnerOfCard(cardOptional.get())){
                deleteCardResponse.setStatusCode(403);
                deleteCardResponse.setMessage("User is not owner of this card");
            }
            else{
                cardRepository.deleteById(cardId);
                deleteCardResponse.setStatusCode(200);
                deleteCardResponse.setMessage("Pack deleted successfully");
            }
        }
        catch (Exception e){
            deleteCardResponse.setStatusCode(500);
            deleteCardResponse.setMessage("Error occurred while deleting card: " + e.getMessage());
        }
        return deleteCardResponse;
    }

    public CardViewModel updateCard(UUID cardId, CardViewModel updateCardRequest) {
        CardViewModel updateCardResponse = new CardViewModel();
        try{
            Optional<CardEntity> cardOptional = cardRepository.findById(cardId);
            if(cardOptional.isEmpty()){
                updateCardResponse.setStatusCode(404);
                updateCardResponse.setMessage("No card found");
            }
            else if(!isUserOwnerOfCard(cardOptional.get())){
                updateCardResponse.setStatusCode(403);
                updateCardResponse.setMessage("User is not owner of this card");
            }
            else{
                cardOptional.get().setQuestion(updateCardRequest.getCardDto().getQuestion());
                cardOptional.get().setAnswer(updateCardRequest.getCardDto().getAnswer());
                if(updateCardRequest.getCardDto().getCardValue() < 0){
                    cardOptional.get().setCardValue(1);
                } else if (updateCardRequest.getCardDto().getCardValue() > 5) {
                    cardOptional.get().setCardValue(5);
                }else{
                    cardOptional.get().setCardValue(updateCardRequest.getCardDto().getCardValue());
                }
                CardEntity savedEntity = cardRepository.save(cardOptional.get());
                updateCardResponse.setCardDto(cardMapper.cardEntityToDto(savedEntity));
                updateCardResponse.setStatusCode(200);
                updateCardResponse.setMessage("Card updated successfully");
            }
        }
        catch (Exception e){
            updateCardResponse.setStatusCode(500);
            updateCardResponse.setMessage("Error occurred while deleting card: " + e.getMessage());
        }
        return updateCardResponse;
    }
}
