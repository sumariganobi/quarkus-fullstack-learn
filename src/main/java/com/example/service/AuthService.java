package com.example.service;

import at.favre.lib.crypto.bcrypt.BCrypt;
import com.example.dto.LoginRequest;
import com.example.dto.LoginResponse;
import com.example.dto.RegisterRequest;
import com.example.entity.User;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Response;

@ApplicationScoped
public class AuthService {

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

            // Generate simple token (in production, use JWT)
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
