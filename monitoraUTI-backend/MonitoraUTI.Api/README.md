# MonitoraUTI Backend

ASP.NET Core .NET 8 Web API for hospital diaper monitoring (ESP32 alerts).

Run:

1. dotnet restore
2. dotnet run --project MonitoraUTI.Api

API endpoints:
- GET /api/beds
- POST /api/beds
- POST /api/alerts
- POST /api/beds/{id}/clear-alert
- GET /api/dashboard
