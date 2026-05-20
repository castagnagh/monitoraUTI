using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;

namespace MonitoraUTI.Api.Data;

public static class SchemaUpdater
{
    public static void EnsureCompatibility(AppDbContext db)
    {
        EnsureColumn(db, "Beds", "PatientName", "TEXT NULL");
        EnsureColumn(db, "Beds", "AdmissionReason", "TEXT NULL");
        EnsureColumn(db, "Beds", "CurrentHumidity", "REAL NULL");
        EnsureColumn(db, "Beds", "HumidityStatus", "TEXT NOT NULL DEFAULT 'Normal'");
    }

    private static void EnsureColumn(AppDbContext db, string tableName, string columnName, string sqlType)
    {
        var conn = db.Database.GetDbConnection();
        if (conn.State != System.Data.ConnectionState.Open)
        {
            conn.Open();
        }

        using var checkCmd = conn.CreateCommand();
        checkCmd.CommandText = $"PRAGMA table_info({tableName});";

        var exists = false;
        using (var reader = checkCmd.ExecuteReader())
        {
            while (reader.Read())
            {
                var name = reader.GetString(1);
                if (string.Equals(name, columnName, StringComparison.OrdinalIgnoreCase))
                {
                    exists = true;
                    break;
                }
            }
        }

        if (!exists)
        {
            using var alterCmd = conn.CreateCommand();
            alterCmd.CommandText = $"ALTER TABLE {tableName} ADD COLUMN {columnName} {sqlType};";
            alterCmd.ExecuteNonQuery();
        }
    }
}
