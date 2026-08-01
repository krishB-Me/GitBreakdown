import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SUPABASE_URL = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")

    @classmethod 
    def validate(cls):
        if not cls.SUPABASE_KEY or not cls.SUPABASE_URL:
            raise ValueError(
                "CRITICAL: Missing SUPABASE_URL or SUPABASE_KEY in environment variables."
            )
        
Config.validate()
