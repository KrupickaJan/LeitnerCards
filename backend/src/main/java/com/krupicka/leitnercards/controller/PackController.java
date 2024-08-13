package com.krupicka.leitnercards.controller;

import com.krupicka.leitnercards.viewModel.PackViewModel;
import com.krupicka.leitnercards.service.PackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
public class PackController {
    @Autowired
    private PackService packService;

    @PostMapping("/user/pack/create")
    public ResponseEntity<PackViewModel> createPack(@RequestBody PackViewModel createPackRequest){
        return ResponseEntity.ok(packService.createPack(createPackRequest));
    }

    @GetMapping("/user/pack/getPacks/{topicId}")
    public ResponseEntity<PackViewModel> getPacks(@PathVariable UUID topicId){
        return ResponseEntity.ok(packService.getPacks(topicId));
    }

    @DeleteMapping("/user/pack/delete/{packId}")
    public ResponseEntity<PackViewModel> deletePack(@PathVariable UUID packId){
        return ResponseEntity.ok(packService.deletePack(packId));
    }

    @PutMapping("/user/pack/update/{packId}")
    public ResponseEntity<PackViewModel> updatePack(@RequestBody PackViewModel updatePackRequest, @PathVariable UUID packId){
        return ResponseEntity.ok(packService.updatePack(updatePackRequest, packId));
    }

    @GetMapping("/user/pack/update-session/{packId}")
    public ResponseEntity<PackViewModel> updateSession(@PathVariable UUID packId){
        return ResponseEntity.ok(packService.updateSession(packId));
    }
}
