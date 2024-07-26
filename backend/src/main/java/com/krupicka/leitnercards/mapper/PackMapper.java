package com.krupicka.leitnercards.mapper;

import com.krupicka.leitnercards.dto.PackDto;
import com.krupicka.leitnercards.entity.PackEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class PackMapper {

    @Autowired
    TopicMapper topicMapper;

    public PackDto packEntityToDto(PackEntity packEntity){
        PackDto packDto = new PackDto();
        packDto.setName(packEntity.getName());
        packDto.setId(packEntity.getId());
        packDto.setTopic(topicMapper.topicEntityToDto(packEntity.getTopic()));
        packDto.setSession(packEntity.getSession());

        return packDto;
    }

    public PackEntity packDtoToEntity(PackDto packDto){
        PackEntity packEntity = new PackEntity();
        packEntity.setName(packDto.getName());
        packEntity.setId(packDto.getId());
        if(packDto.getTopic() != null){
            packEntity.setTopic(topicMapper.topicDtoToEntity(packDto.getTopic()));
        }
        packEntity.setSession(packDto.getSession());

        return packEntity;
    }
}
