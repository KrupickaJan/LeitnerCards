package com.krupicka.leitnercards.controller;

import com.krupicka.leitnercards.viewModel.CardViewModel;
import com.krupicka.leitnercards.service.CardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class CardController {
    @Autowired
    private CardService cardService;

    @PostMapping("/user/card/create")
    public ResponseEntity<CardViewModel> createCard(@RequestBody CardViewModel createCardRequest){
        return ResponseEntity.ok(cardService.createCard(createCardRequest));
    }

    @GetMapping("/user/card/getCards/{packId}")
    public ResponseEntity<CardViewModel> getCards(@PathVariable Integer packId){
        return ResponseEntity.ok(cardService.getCards(packId));
    }

    @PostMapping("/user/card/getCardsFromPacks")
    public ResponseEntity<CardViewModel> getCardsFromPacks(@RequestBody Integer[] getCardsFromPacksRequest){
        return ResponseEntity.ok(cardService.getCardsFromPacks(getCardsFromPacksRequest));
    }

    @DeleteMapping("/user/card/deleteCard/{cardId}")
    public ResponseEntity<CardViewModel> deleteCard(@PathVariable Integer cardId){
        return ResponseEntity.ok(cardService.deleteCard(cardId));
    }

    @PutMapping("/user/card/updateCard/{cardId}")
    public ResponseEntity<CardViewModel> updateCard(@PathVariable Integer cardId, @RequestBody CardViewModel updateCardRequest){
        return ResponseEntity.ok(cardService.updateCard(cardId, updateCardRequest));
    }
}
