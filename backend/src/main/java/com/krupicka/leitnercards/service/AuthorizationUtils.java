package com.krupicka.leitnercards.service;

import com.krupicka.leitnercards.entity.CardEntity;
import com.krupicka.leitnercards.entity.PackEntity;
import com.krupicka.leitnercards.entity.TopicEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class AuthorizationUtils {

    public static boolean isUserOwnerOfPack(PackEntity packEntity){
        String authEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        String reqEmail = packEntity.getTopic().getUser().getEmail();
        return authEmail.equals(reqEmail);
    }

    public static boolean isUserOwnerOfTopic(TopicEntity topicEntity){
        String authEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        String reqEmail = topicEntity.getUser().getEmail();
        return authEmail.equals(reqEmail);
    }

    public static boolean isUserOwnerOfCard(CardEntity cardEntity){
        String authEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        String reqEmail = cardEntity.getPack().getTopic().getUser().getEmail();
        return authEmail.equals(reqEmail);
    }
}
