package com.example.service;

import at.favre.lib.crypto.bcrypt.BCrypt;
import com.example.client.ExternalAuthClient;
import com.example.dto.LoginRequest;
import com.example.dto.LoginResponse;
import com.example.dto.RegisterRequest;
import com.example.entity.User;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.rest.client.inject.RestClient;

import java.util.HashMap;
import java.util.Map;

@ApplicationScoped
public class AuthService {

    @Inject
    @RestClient
    ExternalAuthClient externalAuthClient;

    @Transactional
    public User register(RegisterRequest request) {
        // Check if username exists
        if (User.findByUsername(request.username) != null) {
            throw new BadRequestException("Username already exists");
        }

        // Check if email exists
        if (User.findByEmail(request.email) != null) {
            throw new BadRequestException("Email already exists");
        }

        // Create new user
        User user = new User();
        user.username = request.username;
        user.email = request.email;
        user.password = hashPassword(request.password);
        user.fullName = request.fullName;
        user.roles = "user";
        user.isActive = true;
        user.persist();

        return user;
    }

    @Transactional
    public LoginResponse login(LoginRequest request) {
        try {
            // Try external API authentication first
            boolean externalAuthSuccess = false;
            try {
                Map<String, String> credentials = new HashMap<>();
                credentials.put("username", request.username);
                credentials.put("password", request.password);
                
                Map<String, Object> apiResponse = externalAuthClient.login(credentials);
                externalAuthSuccess = true;
                
                System.out.println("External API authentication successful for user: " + request.username);
            } catch (Exception e) {
                System.out.println("External API authentication failed, trying database: " + e.getMessage());
                externalAuthSuccess = false;
            }
            
            // If external API fails, try database authentication
            if (!externalAuthSuccess) {
                User user = User.findByUsername(request.username);
                
                if (user == null || !user.isActive) {
                    throw new WebApplicationException(
                        Response.status(Response.Status.UNAUTHORIZED)
                            .entity("{\"message\":\"Invalid credentials\"}")
                            .build()
                    );
                }
                
                if (!verifyPassword(request.password, user.password)) {
                    throw new WebApplicationException(
                        Response.status(Response.Status.UNAUTHORIZED)
                            .entity("{\"message\":\"Invalid credentials\"}")
                            .build()
                    );
                }
                
                System.out.println("Database authentication successful for user: " + request.username);
            }
            
            // Find or create user in local database
            User user = User.findByUsername(request.username);
            
            if (user == null) {
                // Create user if not exists (for external API users)
                user = new User();
                user.username = request.username;
                user.email = request.username + "@assa.id";
                user.password = hashPassword(request.password);
                user.fullName = request.username;
                user.roles = "user";
                user.isActive = true;
                user.persist();
                
                System.out.println("Created new user in database: " + request.username);
            }
            
            // Generate token
            String token = generateToken(user);
            
            return new LoginResponse(token, user.username, user.email, user.fullName, user.roles);
            
        } catch (WebApplicationException e) {
            throw e;
        } catch (Exception e) {
            e.printStackTrace();
            throw new WebApplicationException(
                Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"message\":\"Login failed: " + e.getMessage() + "\"}")
                    .build()
            );
        }
    }

    private String hashPassword(String password) {
        return BCrypt.withDefaults().hashToString(12, password.toCharArray());
    }

    private boolean verifyPassword(String password, String hashedPassword) {
        BCrypt.Result result = BCrypt.verifyer().verify(password.toCharArray(), hashedPassword);
        return result.verified;
    }

    private String generateToken(User user) {
        // Simple token for demo (in production, use JWT with io.quarkus:quarkus-smallrye-jwt)
        return "Bearer_" + user.username + "_" + System.currentTimeMillis();
    }
}
