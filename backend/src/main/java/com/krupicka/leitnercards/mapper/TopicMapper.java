package com.krupicka.leitnercards.mapper;

import com.krupicka.leitnercards.dto.TopicDto;
import com.krupicka.leitnercards.entity.TopicEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class TopicMapper {

//    @Autowired
//    private UserMapper userMapper;

    public TopicDto topicEntityToDto(TopicEntity topicEntity){
        TopicDto topicDto = new TopicDto();
        topicDto.setId(topicEntity.getId());
        topicDto.setName(topicEntity.getName());
//        topicDto.setUser(userMapper.userEntityToDto(topicEntity.getUser()));

        return topicDto;
    }

    public TopicEntity topicDtoToEntity(TopicDto topicDto){
        TopicEntity topicEntity = new TopicEntity();
        topicEntity.setName(topicDto.getName());
//        if(topicDto.getUser() != null){
//            topicEntity.setUser(userMapper.userDtoToEntity(topicDto.getUser()));
//        }

        return topicEntity;
    }
}
