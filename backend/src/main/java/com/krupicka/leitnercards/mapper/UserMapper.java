package com.krupicka.leitnercards.mapper;

import com.krupicka.leitnercards.dto.UserDto;
import com.krupicka.leitnercards.entity.UserEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    @Autowired
    private PasswordEncoder passwordEncoder;

    public UserDto userEntityToDto(UserEntity userEntity) {
        UserDto userDto = new UserDto();

        userDto.setId(userEntity.getId());
        userDto.setEmail(userEntity.getEmail());
        userDto.setName(userEntity.getName());
        userDto.setRole(userEntity.getRole());
        userDto.setPassword(userEntity.getPassword());

        return userDto;
    }

    public UserEntity userDtoToEntity(UserDto userDto){
        UserEntity userEntity = new UserEntity();

        userEntity.setEmail(userDto.getEmail());
        userEntity.setName(userDto.getName());
        userEntity.setRole(userDto.getRole());
        userEntity.setPassword(passwordEncoder.encode(userDto.getPassword()));

        return userEntity;
    }
}
