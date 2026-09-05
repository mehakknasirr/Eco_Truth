import os
from dotenv import load_dotenv
from google import genai

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

print("Checking connection...")

try:
    client = genai.Client(api_key=api_key)
    
    # Updated to the model Google just recommended in your error log
    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents="Say 'Hello, TrustCheck is connected!' if you are working."
    )
    
    print("\n✅ AI Response:")
    print(response.text)

except Exception as e:
    print("\n❌ Error Details:")
    print(e)
