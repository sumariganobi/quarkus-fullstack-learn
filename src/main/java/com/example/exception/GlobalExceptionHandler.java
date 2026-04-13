package com.example.exception;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import jakarta.ws.rs.NotFoundException;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

import java.util.HashMap;
import java.util.Map;

@Provider
public class GlobalExceptionHandler implements ExceptionMapper<Exception> {

    @Override
    public Response toResponse(Exception exception) {
        // Don't handle WebApplicationException - let JAX-RS handle it
        if (exception instanceof WebApplicationException) {
            WebApplicationException wae = (WebApplicationException) exception;
            return wae.getResponse();
        }

        if (exception instanceof NotFoundException) {
            ErrorResponse error = new ErrorResponse(
                    Response.Status.NOT_FOUND.getStatusCode(),
                    exception.getMessage()
            );
            return Response.status(Response.Status.NOT_FOUND).entity(error).build();
        }

        if (exception instanceof ConstraintViolationException) {
            ConstraintViolationException cve = (ConstraintViolationException) exception;
            Map<String, String> errors = new HashMap<>();
            
            for (ConstraintViolation<?> violation : cve.getConstraintViolations()) {
                String propertyPath = violation.getPropertyPath().toString();
                String message = violation.getMessage();
                errors.put(propertyPath, message);
            }
            
            ErrorResponse error = new ErrorResponse(
                    Response.Status.BAD_REQUEST.getStatusCode(),
                    "Validation failed",
                    errors
            );
            return Response.status(Response.Status.BAD_REQUEST).entity(error).build();
        }

        // Generic error handler
        ErrorResponse error = new ErrorResponse(
                Response.Status.INTERNAL_SERVER_ERROR.getStatusCode(),
                "Internal server error: " + exception.getMessage()
        );
        return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(error).build();
    }
}
