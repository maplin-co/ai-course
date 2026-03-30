import asyncio
import os
from sqlalchemy import text
from backend.sql_database import engine

async def check_columns():
    """
    Check if the required columns exist in the users table.
    If they don't, we'll try to add them.
    """
    async with engine.begin() as conn:
        try:
            # Check for role, plan, subscription_status, and trial_ends_at
            columns_to_add = []
            
            # Use raw SQL to check columns (Postgres specific)
            result = await conn.execute(text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name = 'users'
            """))
            existing_columns = [row[0] for row in result.fetchall()]
            
            print(f"Existing columns: {existing_columns}")
            
            expected_columns = [
                ('plan', 'VARCHAR DEFAULT \'basic\''),
                ('role', 'VARCHAR DEFAULT \'learner\''),
                ('subscription_status', 'VARCHAR DEFAULT \'trial\''),
                ('trial_ends_at', 'TIMESTAMP WITHOUT TIME ZONE')
            ]
            
            for col, col_type in expected_columns:
                if col not in existing_columns:
                    print(f"Adding missing column: {col}")
                    await conn.execute(text(f"ALTER TABLE users ADD COLUMN {col} {col_type}"))
            
            print("SUCCESS: Database schema updated!")
            
        except Exception as e:
            print(f"ERROR: {e}")

if __name__ == "__main__":
    asyncio.run(check_columns())
