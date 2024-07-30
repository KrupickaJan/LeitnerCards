package com.krupicka.leitnercards.service;

import com.krupicka.leitnercards.dto.PackDto;
import com.krupicka.leitnercards.dto.TopicDto;
import com.krupicka.leitnercards.entity.PackEntity;
import com.krupicka.leitnercards.mapper.PackMapper;
import com.krupicka.leitnercards.repository.PackRepository;
import com.krupicka.leitnercards.viewModel.TopicViewModel;
import com.krupicka.leitnercards.entity.TopicEntity;
import com.krupicka.leitnercards.entity.UserEntity;
import com.krupicka.leitnercards.mapper.TopicMapper;
import com.krupicka.leitnercards.mapper.UserMapper;
import com.krupicka.leitnercards.repository.TopicRepository;
import com.krupicka.leitnercards.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

import static com.krupicka.leitnercards.service.AuthorizationUtils.isUserOwnerOfTopic;

@Service
public class TopicService {

    @Autowired
    private TopicRepository topicRepository;
    @Autowired
    private TopicMapper topicMapper;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PackRepository packRepository;
    @Autowired
    private UserMapper userMapper;
    @Autowired
    private PackMapper packMapper;

    @Transactional
    public TopicViewModel createTopic(TopicViewModel topicCreateRequest) {
        TopicViewModel topicCreateResponse = new TopicViewModel();
        try {
            String authEmail = SecurityContextHolder.getContext().getAuthentication().getName();
            Optional<UserEntity> userOptional = userRepository.findByEmail(authEmail);
            if (userOptional.isEmpty()) {
                topicCreateResponse.setStatusCode(404);
                topicCreateResponse.setMessage("No users found");
            }
            else{
                UserEntity userEntity = userOptional.get();
                TopicEntity topicEntity = topicMapper.topicDtoToEntity(topicCreateRequest.getTopicDto());
                topicEntity.setUser(userEntity);
                TopicEntity topicResult = topicRepository.save(topicEntity);
                topicCreateResponse.setTopicDto(topicMapper.topicEntityToDto(topicResult));
                topicCreateResponse.setMessage("Topic created successfully");
                topicCreateResponse.setStatusCode(200);
            }
        } catch (Exception e) {
            topicCreateResponse.setStatusCode(500);
            topicCreateResponse.setError(e.getMessage());
        }
        return topicCreateResponse;
    }

    public TopicViewModel getUsersTopics(){
        TopicViewModel getUsersTopicsResponse = new TopicViewModel();
        getUsersTopicsResponse.setTopicsList(new ArrayList<>());
        try{
            String authEmail = SecurityContextHolder.getContext().getAuthentication().getName();
            Optional<UserEntity> userOptional = userRepository.findByEmail(authEmail);
            if(userOptional.isEmpty()){
                getUsersTopicsResponse.setStatusCode(404);
                getUsersTopicsResponse.setMessage("No users found");
            }
            else{
                Integer userId = userOptional.get().getId();
                List<TopicEntity> usersTopicEntities = topicRepository
                        .findAll()
                        .stream()
                        .filter(topic ->
                                Objects.equals(topic
                                        .getUser()
                                        .getId(), userId)).toList();
                usersTopicEntities.forEach(topicEntity -> {
                    TopicDto topicDto = topicMapper.topicEntityToDto(topicEntity);
                    topicDto.setPacksList(getTopicPacks(topicEntity.getId()));
                    getUsersTopicsResponse.getTopicsList()
                            .add(topicDto);
                });
                getUsersTopicsResponse.setStatusCode(200);
                getUsersTopicsResponse.setMessage("Successful");
            }
        }
        catch (Exception e){
            getUsersTopicsResponse.setStatusCode(500);
            getUsersTopicsResponse.setMessage("Error occurred while getting users topics: " + e.getMessage());
        }
        return getUsersTopicsResponse;
    }

    public TopicViewModel deleteTopic(Integer topicId){
        TopicViewModel deleteTopicResponse = new TopicViewModel();
        try {
            Optional<TopicEntity> topicOptional = topicRepository.findById(topicId);
            if(topicOptional.isEmpty()){
                deleteTopicResponse.setStatusCode(404);
                deleteTopicResponse.setMessage("No topic found");
            }
            else if(!isUserOwnerOfTopic(topicOptional.get())){
                    deleteTopicResponse.setStatusCode(403);
                    deleteTopicResponse.setMessage("User is not owner of this topic ");
            }
            else{
                topicRepository.deleteById(topicId);
                deleteTopicResponse.setStatusCode(200);
                deleteTopicResponse.setMessage("Topic deleted successfully");
            }
        }
        catch (Exception e){
            deleteTopicResponse.setStatusCode(500);
            deleteTopicResponse.setMessage("Error occurred while deleting topic: " + e.getMessage());
        }
        return deleteTopicResponse;
    }

    public TopicViewModel updateTopic(Integer topicId, TopicViewModel updateTopicRequest){
        TopicViewModel updateTopicResponse = new TopicViewModel();
        try{
            Optional<TopicEntity> topicOptional = topicRepository.findById(topicId);
            if(topicOptional.isEmpty()){
                updateTopicResponse.setStatusCode(404);
                updateTopicResponse.setMessage("User not found for update");
            }
            else if(!isUserOwnerOfTopic(topicOptional.get())){
                    updateTopicResponse.setStatusCode(403);
                    updateTopicResponse.setMessage("User is not owner of this topic");
            }
            else{
            topicOptional.get().setName(updateTopicRequest.getTopicDto().getName());
                TopicEntity savedEntity = topicRepository.save(topicOptional.get());
                updateTopicResponse.setTopicDto(topicMapper.topicEntityToDto(savedEntity));
                updateTopicResponse.setStatusCode(200);
                updateTopicResponse.setMessage("Topic updated successfully");
            }
        }
        catch (Exception e){
            updateTopicResponse.setStatusCode(500);
            updateTopicResponse.setMessage("Error occurred while updating topic: " + e.getMessage());
        }
        return updateTopicResponse;
    }

    private List<PackDto> getTopicPacks(Integer topicId){
        List<PackDto> listOfPacks = new ArrayList<>();
        Optional<TopicEntity> topicOptional = topicRepository.findById(topicId);
        if(topicOptional.isPresent()){
            List<PackEntity> packEntities = packRepository
                    .findAll()
                    .stream()
                    .filter(pack ->
                            Objects.equals(pack
                                    .getTopic()
                                    .getId(), topicId))
                    .toList();
            packEntities.forEach(packEntity ->
                    listOfPacks.add(packMapper.packEntityToDto(packEntity)));
        }
        return listOfPacks;
    }
}
