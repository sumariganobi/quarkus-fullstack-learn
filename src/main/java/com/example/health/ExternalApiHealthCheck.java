package com.example.health;

import com.example.client.ExternalAuthClient;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.eclipse.microprofile.health.HealthCheck;
import org.eclipse.microprofile.health.HealthCheckResponse;
import org.eclipse.microprofile.health.Readiness;
import org.eclipse.microprofile.rest.client.inject.RestClient;

@Readiness
@ApplicationScoped
public class ExternalApiHealthCheck implements HealthCheck {

    @Inject
    @RestClient
    ExternalAuthClient externalAuthClient;

    @Override
    public HealthCheckResponse call() {
        try {
            // Try to call external API (will fail but we just check connectivity)
            externalAuthClient.login(java.util.Map.of("username", "healthcheck", "password", "test"));
            
            return HealthCheckResponse.named("External Auth API health check")
                    .up()
                    .withData("api", "https://devhcbead.assa.id")
                    .build();
        } catch (Exception e) {
            // Even if authentication fails, if we get a response, API is reachable
            String message = e.getMessage();
            boolean isReachable = message != null && !message.contains("timeout") && !message.contains("Connection refused");
            
            return HealthCheckResponse.named("External Auth API health check")
                    .status(isReachable)
                    .withData("api", "https://devhcbead.assa.id")
                    .withData("note", isReachable ? "API reachable (auth failed as expected)" : "API unreachable")
                    .build();
        }
    }
}
