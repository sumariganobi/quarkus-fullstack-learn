package com.example.resource;

import com.example.dto.LoginRequest;
import com.example.dto.LoginResponse;
import com.example.dto.RegisterRequest;
import com.example.entity.User;
import com.example.service.AuthService;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.Map;

@Path("/api/auth")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AuthResource {

    @Inject
    AuthService authService;

    @POST
    @Path("/register")
    public Response register(@Valid RegisterRequest request) {
        try {
            User user = authService.register(request);
            return Response.status(Response.Status.CREATED)
                    .entity(Map.of(
                            "message", "User registered successfully",
                            "username", user.username,
                            "email", user.email
                    ))
                    .build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(Map.of("message", e.getMessage()))
                    .build();
        }
    }

    @POST
    @Path("/login")
    public Response login(@Valid LoginRequest request) {
        try {
            LoginResponse response = authService.login(request);
            return Response.ok(response).build();
        } catch (Exception e) {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity(Map.of("message", "Invalid credentials"))
                    .build();
        }
    }

    @GET
    @Path("/me")
    public Response getCurrentUser(@HeaderParam("Authorization") String token) {
        try {
            if (token == null || !token.startsWith("Bearer_")) {
                return Response.status(Response.Status.UNAUTHORIZED)
                        .entity(Map.of("message", "Invalid token"))
                        .build();
            }

            String username = token.split("_")[1];
            User user = User.findByUsername(username);

            if (user == null) {
                return Response.status(Response.Status.UNAUTHORIZED)
                        .entity(Map.of("message", "User not found"))
                        .build();
            }

            return Response.ok(Map.of(
                    "username", user.username,
                    "email", user.email,
                    "fullName", user.fullName,
                    "roles", user.roles
            )).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(Map.of("message", e.getMessage()))
                    .build();
        }
    }
}

