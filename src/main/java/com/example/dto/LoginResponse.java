package com.example.dto;

public class LoginResponse {

    public String token;
    public String username;
    public String email;
    public String fullName;
    public String roles;

    public LoginResponse(String token, String username, String email, String fullName, String roles) {
        this.token = token;
        this.username = username;
        this.email = email;
        this.fullName = fullName;
        this.roles = roles;
    }
}
