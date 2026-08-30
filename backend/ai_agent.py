import google.generativeai as genai
import os
import json
from dotenv import load_dotenv

load_dotenv()

# Configure Google Gemini
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
else:
    print("WARNING: GEMINI_API_KEY not found in environment variables.")

def analyze_symptoms(symptoms: str) -> dict:
    if not GEMINI_API_KEY:
        return {
            "suggested_specialty": "General Physician",
            "explanation": "API key not configured. Defaulting to General Physician."
        }
    
    try:
        model = genai.GenerativeModel('gemini-2.5-flash')
        prompt = f"""
        You are a medical AI assistant. Your job is to analyze the patient's symptoms and recommend the most appropriate doctor specialty from the following list:
        [General Physician, Cardiologist, Dermatologist, Neurologist, Orthopedist, Pediatrician, Psychiatrist, Gynecologist, ENT Specialist].
        
        Patient's symptoms: "{symptoms}"
        
        Respond ONLY with a valid JSON object in this exact format:
        {{
            "suggested_specialty": "The Specialty Name",
            "explanation": "A brief 1-2 sentence explanation of why this specialty is appropriate."
        }}
        """
        
        response = model.generate_content(prompt)
        text = response.text
        # Clean up any potential markdown formatting
        if text.startswith("```json"):
            text = text[7:-3]
        elif text.startswith("```"):
            text = text[3:-3]
            
        result = json.loads(text.strip())
        return result
    except Exception as e:
        print(f"Error in AI Agent: {e}")
        return {
            "suggested_specialty": "General Physician",
            "explanation": "Could not analyze symptoms at this time. We recommend starting with a General Physician."
        }
