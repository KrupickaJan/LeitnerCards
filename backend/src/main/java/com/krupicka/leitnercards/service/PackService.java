package com.krupicka.leitnercards.service;

import com.krupicka.leitnercards.viewModel.PackViewModel;
import com.krupicka.leitnercards.entity.CardEntity;
import com.krupicka.leitnercards.entity.PackEntity;
import com.krupicka.leitnercards.entity.TopicEntity;
import com.krupicka.leitnercards.mapper.PackMapper;
import com.krupicka.leitnercards.repository.CardRepository;
import com.krupicka.leitnercards.repository.PackRepository;
import com.krupicka.leitnercards.repository.TopicRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

import static com.krupicka.leitnercards.service.AuthorizationUtils.isUserOwnerOfPack;
import static com.krupicka.leitnercards.service.AuthorizationUtils.isUserOwnerOfTopic;

@Service
public class PackService {

    @Autowired
    private TopicRepository topicRepository;
    @Autowired
    private PackMapper packMapper;
    @Autowired
    private PackRepository packRepository;
    @Autowired
    private CardRepository cardRepository;

    @Transactional
    public PackViewModel createPack(PackViewModel packCreateRequest){
        PackViewModel packCreateResponse = new PackViewModel();
        try{

            UUID topicId = packCreateRequest.getPackDto().getTopic().getId();

            Optional<TopicEntity> topicOptional = topicRepository.findById(topicId);
            if(topicOptional.isEmpty()){
                packCreateResponse.setStatusCode(404);
                packCreateResponse.setMessage("No topic found");
            }
            else if(!isUserOwnerOfTopic(topicOptional.get())){
                    packCreateResponse.setStatusCode(403);
                    packCreateResponse.setMessage("User is not owner of this topic");
            }
            else{
                packCreateRequest.getPackDto().setSession(1);
                PackEntity packEntity = packMapper.packDtoToEntity(packCreateRequest.getPackDto());
                packEntity.setTopic(topicOptional.get());
                PackEntity packResult = packRepository.save(packEntity);
                packCreateResponse.setPackDto(packMapper.packEntityToDto(packResult));
                packCreateResponse.setMessage("Pack created successfully");
                packCreateResponse.setStatusCode(200);
            }
        }
        catch (Exception e){
            packCreateResponse.setStatusCode(500);
            packCreateResponse.setError(e.getMessage());
        }
        return packCreateResponse;
    }

    public PackViewModel getPacks(UUID topicId) {
        PackViewModel getPacksResponse = new PackViewModel();
        getPacksResponse.setPacksList(new ArrayList<>());
        try{
            Optional<TopicEntity> topicOptional = topicRepository.findById(topicId);
            if(topicOptional.isEmpty()){
                getPacksResponse.setStatusCode(404);
                getPacksResponse.setMessage("No topic found");
            }
            else if(!isUserOwnerOfTopic(topicOptional.get())){
                    getPacksResponse.setStatusCode(403);
                    getPacksResponse.setMessage("User is not owner of this topic");
            }
            else{
                List<PackEntity> packEntities = packRepository
                        .findAll()
                        .stream()
                        .filter(pack ->
                                Objects.equals(pack
                                        .getTopic()
                                        .getId(), topicId))
                        .toList();
                packEntities.forEach(packEntity ->
                        getPacksResponse
                                .getPacksList()
                                .add(packMapper.packEntityToDto(packEntity)));
                getPacksResponse.setStatusCode(200);
                getPacksResponse.setMessage("Successful");
            }
        }
        catch (Exception e){
            getPacksResponse.setStatusCode(500);
            getPacksResponse.setMessage("Error occurred while getting packs: " + e.getMessage());
        }
        return getPacksResponse;
    }

    public PackViewModel deletePack(UUID packId){
        PackViewModel deletePackResponse = new PackViewModel();
        try{
            Optional<PackEntity> packOptional = packRepository.findById(packId);
            if(packOptional.isEmpty())
            {
                deletePackResponse.setStatusCode(404);
                deletePackResponse.setMessage("No pack found");
            }
            else if (!isUserOwnerOfPack(packOptional.get())) {
                deletePackResponse.setStatusCode(403);
                deletePackResponse.setMessage("User is not owner of this pack");
            }
            else {
                packRepository.deleteById(packId);
                deletePackResponse.setStatusCode(200);
                deletePackResponse.setMessage("Pack deleted successfully");
            }
        }
        catch (Exception e){
            deletePackResponse.setStatusCode(500);
            deletePackResponse.setMessage("Error occurred while deleting pack: " + e.getMessage());
        }
        return deletePackResponse;
    }

    public PackViewModel updatePack(PackViewModel updatePackRequest, UUID packId) {
        PackViewModel updatePackResponse = new PackViewModel();
        try{
            Optional<PackEntity> packOptional = packRepository.findById(packId);
            if(packOptional.isEmpty()){
                updatePackResponse.setStatusCode(404);
                updatePackResponse.setMessage("No pack found");
            }
            else if (!isUserOwnerOfPack(packOptional.get())) {
                updatePackResponse.setStatusCode(403);
                updatePackResponse.setMessage("User is not owner of this pack");
            }
            else{
                packOptional.get().setName(updatePackRequest.getPackDto().getName());
                PackEntity savedEntity = packRepository.save(packOptional.get());
                updatePackResponse.setPackDto(packMapper.packEntityToDto(savedEntity));
                updatePackResponse.setStatusCode(200);
                updatePackResponse.setMessage("Pack updated successfully");
            }
        }
        catch (Exception e){
        updatePackResponse.setStatusCode(500);
        updatePackResponse.setMessage("Error occurred while updating pack: " + e.getMessage());
        }
        return updatePackResponse;
    }

    public PackViewModel updateSession(UUID packId) {
        PackViewModel updatePackResponse = new PackViewModel();
        try{
            Optional<PackEntity> packOptional = packRepository.findById(packId);
            if(packOptional.isEmpty()){
                updatePackResponse.setStatusCode(404);
                updatePackResponse.setMessage("No pack found");
            }
            else if (!isUserOwnerOfPack(packOptional.get())) {
                updatePackResponse.setStatusCode(403);
                updatePackResponse.setMessage("User is not owner of this pack");
            }
            else{
                PackEntity packEntity = packOptional.get();
                if(packEntity.getSession() == 5){
                    packEntity.setSession(1);
                }
                else{
                    packEntity.setSession(packEntity.getSession()+1);
                }
                int smallestCardValue = findSmallestCardValueInPack(packId);
                if(packEntity.getSession() < smallestCardValue){
                    packEntity.setSession(smallestCardValue);
                }
                PackEntity savedEntity = packRepository.save(packOptional.get());
                updatePackResponse.setPackDto(packMapper.packEntityToDto(savedEntity));
                updatePackResponse.setStatusCode(200);
                updatePackResponse.setMessage("Session updated successfully");
            }
        }
        catch (Exception e){
            updatePackResponse.setStatusCode(500);
            updatePackResponse.setMessage("Error occurred while updating session: " + e.getMessage());
        }
        return updatePackResponse;
    }

    private int findSmallestCardValueInPack(UUID packId){
        int minCardValue;
        List<CardEntity> cardEntities = cardRepository
                .findAll()
                .stream()
                .filter(card ->
                        Objects.equals(card.getPack().getId(), packId)
                )
                .toList();

        OptionalInt optionalInt = cardEntities.stream().mapToInt(CardEntity::getCardValue).min();
        if(optionalInt.isEmpty()){
            minCardValue = 5;
        }else{
            minCardValue = optionalInt.getAsInt();
        }
        return minCardValue;
    }
}
