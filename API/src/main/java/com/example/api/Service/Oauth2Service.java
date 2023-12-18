package com.example.api.Service;

import com.example.api.DTO.OauthUserInfoDTO;
import com.example.api.DTO.TokenResponseDTO;
import com.example.api.DTO.UserResponseDTO;
import com.example.api.Entity.User;
import com.example.api.Exception.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class Oauth2Service {

    @Value("${OAUTH_URI}")
    private String uri;

    @Value("${OAUTH_REDIRECT_URI}")
    private String redirect_uri;

    @Value("${OAUTH_CLIENT_ID}")
    private String client_id;

    @Value("${OAUTH_CLIENT_SECRET}")
    private String client_secret;

    @Value("${OAUTH_USERINFO}")
    private String oauth_userInfo;

    @Autowired
    private UserServiceImpl userService;
    public TokenResponseDTO getTokenFromGoogle(String code) {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
        map.add("code", code);
        map.add("client_id", client_id);
        map.add("client_secret", client_secret);
        map.add("redirect_uri", redirect_uri);
        map.add("grant_type", "authorization_code");

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(map, httpHeaders);

        ResponseEntity<TokenResponseDTO> response = restTemplate.postForEntity(uri, request, TokenResponseDTO.class);

        return response.getBody();
    }

    public User getUserInfoFromGoogle(TokenResponseDTO token) throws NotFoundException {
        RestTemplate restTemplate = new RestTemplate();
        UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(oauth_userInfo)
                .queryParam("access_token", token.getAccess_token())
                .queryParam("alt", "json");

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token.getId_token());

        OauthUserInfoDTO userInfo = restTemplate.getForObject(builder.toUriString(), OauthUserInfoDTO.class, headers);

        try {
            return userService.loginWithGoogle(userInfo.getEmail());
        } catch (NotFoundException ex) {
            throw ex;
        }
    }
}
