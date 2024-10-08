package com.krupicka.leitnercards.viewModel;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class BaseViewModel {

    private int statusCode;
    private String error;
    private String message;
    private String token;
    private String refreshToken;
}
