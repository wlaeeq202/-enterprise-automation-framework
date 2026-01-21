using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = WebApplication.CreateBuilder(args);

// In-memory COST repository (simulating a C# + SQL backend)
builder.Services.AddSingleton<ICostRepository, InMemoryCostRepository>();

var app = builder.Build();

// Optional: fix the URL so it's predictable (e.g., http://localhost:5050)
app.Urls.Add("http://localhost:5050");

// Basic endpoints for a COST-style service

// GET /api/costs
app.MapGet("/api/costs", (ICostRepository repo) =>
{
    return Results.Ok(repo.GetAll());
});

// GET /api/costs/{id}
app.MapGet("/api/costs/{id:int}", (ICostRepository repo, int id) =>
{
    var cost = repo.GetById(id);
    return cost is not null ? Results.Ok(cost) : Results.NotFound();
});

// POST /api/costs
app.MapPost("/api/costs", (ICostRepository repo, Cost cost) =>
{
    var created = repo.Create(cost);
    return Results.Created($"/api/costs/{created.Id}", created);
});

// PATCH /api/costs/{id}
app.MapPatch("/api/costs/{id:int}", (ICostRepository repo, int id, Cost update) =>
{
    var updated = repo.Update(id, update);
    return updated is not null ? Results.Ok(updated) : Results.NotFound();
});

// DELETE /api/costs/{id}
app.MapDelete("/api/costs/{id:int}", (ICostRepository repo, int id) =>
{
    var deleted = repo.Delete(id);
    return deleted ? Results.NoContent() : Results.NotFound();
});

app.Run();

// ---- Domain + Repository (simple in-memory implementation) ----

public record Cost(int Id, string Name, string Department, decimal Amount, string Currency);

public interface ICostRepository
{
    IEnumerable<Cost> GetAll();
    Cost? GetById(int id);
    Cost Create(Cost cost);
    Cost? Update(int id, Cost cost);
    bool Delete(int id);
}

public class InMemoryCostRepository : ICostRepository
{
    private readonly List<Cost> _costs = new()
    {
        new Cost(1, "Cloud Hosting", "IT", 5000m, "USD"),
        new Cost(2, "SaaS Subscriptions", "IT", 1500m, "USD"),
        new Cost(3, "Team Training", "HR", 800m, "USD")
    };

    private int _nextId = 4;

    public IEnumerable<Cost> GetAll() => _costs;

    public Cost? GetById(int id) => _costs.FirstOrDefault(c => c.Id == id);

    public Cost Create(Cost cost)
    {
        var newCost = cost with { Id = _nextId++ };
        _costs.Add(newCost);
        return newCost;
    }

    public Cost? Update(int id, Cost cost)
    {
    var index = _costs.FindIndex(c => c.Id == id);
        if (index == -1) return null;

        var updated = cost with { Id = id };
        _costs[index] = updated;
        return updated;
    }

    public bool Delete(int id)
    {
        var existing = _costs.FirstOrDefault(c => c.Id == id);
        if (existing is null) return false;

        _costs.Remove(existing);
        return true;
    }
}
