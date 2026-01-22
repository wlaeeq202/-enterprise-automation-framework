// ------------------------------------------------------------
// PURPOSE:
// Minimal ASP.NET Core API that simulates a COST service.
// This represents a typical C# backend that would normally
// talk to SQL, but here uses an in-memory repository.
// ------------------------------------------------------------

using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

// Create the WebApplication builder (config + DI container)
var builder = WebApplication.CreateBuilder(args);

// ------------------------------------------------------------
// DEPENDENCY INJECTION SETUP
// ------------------------------------------------------------

// Register ICostRepository with an in-memory implementation
// Singleton lifetime keeps data alive for the app runtime
// (similar to a shared database connection)
builder.Services.AddSingleton<ICostRepository, InMemoryCostRepository>();

// Build the application pipeline
var app = builder.Build();

// ------------------------------------------------------------
// SERVER CONFIGURATION
// ------------------------------------------------------------

// Force a predictable local URL for testing / automation
// Useful for Postman, Playwright, or API automation
app.Urls.Add("http://localhost:5050");

// ------------------------------------------------------------
// API ENDPOINTS (COST SERVICE)
// ------------------------------------------------------------

// GET /api/costs
// Returns all cost records
app.MapGet("/api/costs", (ICostRepository repo) =>
{
    return Results.Ok(repo.GetAll());
});

// GET /api/costs/{id}
// Returns a single cost by ID or 404 if not found
app.MapGet("/api/costs/{id:int}", (ICostRepository repo, int id) =>
{
    var cost = repo.GetById(id);
    return cost is not null
        ? Results.Ok(cost)
        : Results.NotFound();
});

// POST /api/costs
// Creates a new cost record
app.MapPost("/api/costs", (ICostRepository repo, Cost cost) =>
{
    var created = repo.Create(cost);

    // Returns 201 Created with Location header
    return Results.Created($"/api/costs/{created.Id}", created);
});

// PATCH /api/costs/{id}
// Updates an existing cost record
app.MapPatch("/api/costs/{id:int}", (ICostRepository repo, int id, Cost update) =>
{
    var updated = repo.Update(id, update);

    return updated is not null
        ? Results.Ok(updated)
        : Results.NotFound();
});

// DELETE /api/costs/{id}
// Deletes a cost record
app.MapDelete("/api/costs/{id:int}", (ICostRepository repo, int id) =>
{
    var deleted = repo.Delete(id);
    return deleted
        ? Results.NoContent()
        : Results.NotFound();
});

// Start the web server
app.Run();

// ------------------------------------------------------------
// DOMAIN MODEL
// ------------------------------------------------------------

// Immutable record representing a COST entity
// Records are ideal for APIs because they are concise,
// immutable, and value-based
public record Cost(
    int Id,
    string Name,
    string Department,
    decimal Amount,
    string Currency
);

// ------------------------------------------------------------
// REPOSITORY CONTRACT
// ------------------------------------------------------------

// Abstraction layer that hides data storage details
// In real apps, this would be backed by SQL / Snowflake / ORM
public interface ICostRepository
{
    IEnumerable<Cost> GetAll();
    Cost? GetById(int id);
    Cost Create(Cost cost);
    Cost? Update(int id, Cost cost);
    bool Delete(int id);
}

// ------------------------------------------------------------
// IN-MEMORY REPOSITORY IMPLEMENTATION
// ------------------------------------------------------------

// Simulates a database using an in-memory list
// Ideal for demos, tests, and automation frameworks
public class InMemoryCostRepository : ICostRepository
{
    // Seed data to simulate existing database records
    private readonly List<Cost> _costs = new()
    {
        new Cost(1, "Cloud Hosting", "IT", 5000m, "USD"),
        new Cost(2, "SaaS Subscriptions", "IT", 1500m, "USD"),
        new Cost(3, "Team Training", "HR", 800m, "USD")
    };

    // Auto-increment ID simulation
    private int _nextId = 4;

    // Return all records
    public IEnumerable<Cost> GetAll() => _costs;

    // Find a record by ID
    public Cost? GetById(int id) =>
        _costs.FirstOrDefault(c => c.Id == id);

    // Create a new cost record
    public Cost Create(Cost cost)
    {
        var newCost = cost with { Id = _nextId++ };
        _costs.Add(newCost);
        return newCost;
    }

    // Update an existing record
    public Cost? Update(int id, Cost cost)
    {
        var index = _costs.FindIndex(c => c.Id == id);
        if (index == -1) return null;

        var updated = cost with { Id = id };
        _costs[index] = updated;
        return updated;
    }

    // Delete a record
    public bool Delete(int id)
    {
        var existing = _costs.FirstOrDefault(c => c.Id == id);
        if (existing is null) return false;

        _costs.Remove(existing);
        return true;
    }
}
