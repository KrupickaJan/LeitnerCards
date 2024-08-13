package com.krupicka.leitnercards.controller;

import com.krupicka.leitnercards.viewModel.TopicViewModel;
import com.krupicka.leitnercards.service.TopicService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
public class TopicController {
    @Autowired
    private TopicService topicService;

    @PostMapping("/user/topic/create")
    public ResponseEntity<TopicViewModel> create(@RequestBody TopicViewModel topicCreateRequest){
        return ResponseEntity.ok(topicService.createTopic(topicCreateRequest));
    }

    @GetMapping("/user/topic/get-users-topics")
    public ResponseEntity<TopicViewModel> getUsersTopics(){
        return  ResponseEntity.ok(topicService.getUsersTopics());
    }

    @DeleteMapping("/user/topic/delete/{topicId}")
    public ResponseEntity<TopicViewModel> deleteTopicById(@PathVariable UUID topicId){
        return ResponseEntity.ok(topicService.deleteTopic(topicId));
    }

    @PutMapping("/user/topic/update/{topicId}")
    public ResponseEntity<TopicViewModel> updateTopic(@PathVariable UUID topicId, @RequestBody TopicViewModel topicUpdateRequest){
        return ResponseEntity.ok(topicService.updateTopic(topicId, topicUpdateRequest));
    }
}
