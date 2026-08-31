from database import SessionLocal, engine
import models

# Create tables
models.Base.metadata.create_all(bind=engine)

def seed():
    db = SessionLocal()
    
    # Check if doctors exist
    if db.query(models.Doctor).count() == 0:
        doctors = [
            models.Doctor(
                name="Dr. Ali Hassan", 
                specialty="General Physician", 
                bio="Experienced in treating common illnesses and routine checkups.",
                experience_years=12,
                rating=4.8,
                reviews_count=124,
                past_treatments="Fever, Viral Infections, Blood Pressure Management, Diabetes checkups",
                image_url="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=250&auto=format&fit=crop"
            ),
            models.Doctor(
                name="Dr. Sara Khan", 
                specialty="Cardiologist", 
                bio="Heart specialist with over 10 years of experience in major hospitals.",
                experience_years=10,
                rating=4.9,
                reviews_count=89,
                past_treatments="Echocardiograms, Heart Failure Management, Arrhythmia, Bypass Post-care",
                image_url="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=250&auto=format&fit=crop"
            ),
            models.Doctor(
                name="Dr. Ahmed Raza", 
                specialty="Dermatologist", 
                bio="Expert in skin conditions, acne, and cosmetic procedures.",
                experience_years=8,
                rating=4.7,
                reviews_count=210,
                past_treatments="Acne Treatment, Laser Hair Removal, Skin Allergies, Eczema",
                image_url="https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=250&auto=format&fit=crop"
            ),
            models.Doctor(
                name="Dr. Fatima Zain", 
                specialty="Pediatrician", 
                bio="Caring and experienced child specialist.",
                experience_years=15,
                rating=5.0,
                reviews_count=340,
                past_treatments="Vaccinations, Child Growth Tracking, Pediatric Asthma, Flu",
                image_url="https://images.unsplash.com/photo-1594824436998-058b231b1846?q=80&w=250&auto=format&fit=crop"
            ),
            models.Doctor(
                name="Dr. Bilal Yasin", 
                specialty="Neurologist", 
                bio="Specializes in brain and nervous system disorders.",
                experience_years=20,
                rating=4.6,
                reviews_count=76,
                past_treatments="Migraines, Stroke Recovery, Epilepsy, Parkinson's Disease",
                image_url="https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=250&auto=format&fit=crop"
            ),
        ]
        db.add_all(doctors)
        db.commit()
        print("Database seeded with initial doctors.")
    else:
        print("Database already has doctors. Skipping seed.")
        
    db.close()

if __name__ == "__main__":
    seed()
