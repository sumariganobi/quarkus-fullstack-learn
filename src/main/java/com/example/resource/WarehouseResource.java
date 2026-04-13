package com.example.resource;

import com.example.dto.WarehouseRequest;
import com.example.dto.WarehouseResponse;
import com.example.entity.Warehouse;
import com.example.service.WarehouseService;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;
import java.util.stream.Collectors;

@Path("/api/warehouses")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class WarehouseResource {

    @Inject
    WarehouseService warehouseService;

    @GET
    public Response getAllWarehouses(@QueryParam("location") String location,
                                     @QueryParam("available") Boolean available) {
        List<Warehouse> warehouses;
        
        if (location != null && !location.isEmpty()) {
            warehouses = warehouseService.searchWarehousesByLocation(location);
        } else if (available != null && available) {
            warehouses = warehouseService.getAvailableWarehouses();
        } else {
            warehouses = warehouseService.getAllWarehouses();
        }
        
        List<WarehouseResponse> response = warehouses.stream()
                .map(WarehouseResponse::new)
                .collect(Collectors.toList());
        
        return Response.ok(response).build();
    }

    @GET
    @Path("/{id}")
    public Response getWarehouseById(@PathParam("id") Long id) {
        Warehouse warehouse = warehouseService.getWarehouseById(id);
        return Response.ok(new WarehouseResponse(warehouse)).build();
    }

    @POST
    public Response createWarehouse(@Valid WarehouseRequest request) {
        Warehouse warehouse = warehouseService.createWarehouse(request);
        return Response.status(Response.Status.CREATED)
                .entity(new WarehouseResponse(warehouse))
                .build();
    }

    @PUT
    @Path("/{id}")
    public Response updateWarehouse(@PathParam("id") Long id, @Valid WarehouseRequest request) {
        Warehouse warehouse = warehouseService.updateWarehouse(id, request);
        return Response.ok(new WarehouseResponse(warehouse)).build();
    }

    @DELETE
    @Path("/{id}")
    public Response deleteWarehouse(@PathParam("id") Long id) {
        warehouseService.deleteWarehouse(id);
        return Response.noContent().build();
    }
}
