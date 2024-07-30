package com.krupicka.leitnercards.viewModel;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.krupicka.leitnercards.dto.PackDto;
import com.krupicka.leitnercards.dto.TopicDto;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

@EqualsAndHashCode(callSuper = false)
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class TopicViewModel extends BaseViewModel {

    private TopicDto topicDto;
    private List<TopicDto> topicsList;
}
