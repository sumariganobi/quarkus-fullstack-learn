package com.example.health;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.eclipse.microprofile.health.HealthCheck;
import org.eclipse.microprofile.health.HealthCheckResponse;
import org.eclipse.microprofile.health.Liveness;

import javax.sql.DataSource;
import java.sql.Connection;

@Liveness
@ApplicationScoped
public class DatabaseHealthCheck implements HealthCheck {

    @Inject
    DataSource dataSource;

    @Override
    public HealthCheckResponse call() {
        try (Connection connection = dataSource.getConnection()) {
            boolean isValid = connection.isValid(2);
            
            return HealthCheckResponse.named("Database connection health check")
                    .status(isValid)
                    .withData("database", "MySQL")
                    .build();
        } catch (Exception e) {
            return HealthCheckResponse.named("Database connection health check")
                    .down()
                    .withData("error", e.getMessage())
                    .build();
        }
    }
}
