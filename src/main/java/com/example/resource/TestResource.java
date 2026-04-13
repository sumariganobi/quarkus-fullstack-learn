package com.example.resource;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.Map;

@Path("/api/test")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class TestResource {

    @GET
    public Response test() {
        return Response.ok(Map.of("message", "Test endpoint works!")).build();
    }

    @POST
    @Path("/echo")
    public Response echo(Map<String, String> body) {
        return Response.ok(Map.of(
            "received", body,
            "message", "Echo works!"
        )).build();
    }

    @POST
    @Path("/login-bypass")
    public Response loginBypass(Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");
        
        // Simple bypass - always return success for testing
        return Response.ok(Map.of(
            "token", "Bearer_" + username + "_" + System.currentTimeMillis(),
            "username", username,
            "email", username + "@example.com",
            "fullName", "Test User",
            "roles", "admin,user",
            "message", "Bypass login successful!"
        )).build();
    }
}
