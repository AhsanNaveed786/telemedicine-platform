from database import SessionLocal, engine
import models

# Create tables
models.Base.metadata.create_all(bind=engine)

def seed():
    db = SessionLocal()
    
    # Check if doctors exist
    if db.query(models.Doctor).count() == 0:
        doctors = [
            models.Doctor(name="Dr. Ali Hassan", specialty="General Physician", bio="Experienced in treating common illnesses and routine checkups."),
            models.Doctor(name="Dr. Sara Khan", specialty="Cardiologist", bio="Heart specialist with 10 years of experience in major hospitals."),
            models.Doctor(name="Dr. Ahmed Raza", specialty="Dermatologist", bio="Expert in skin conditions, acne, and cosmetic procedures."),
            models.Doctor(name="Dr. Fatima Zain", specialty="Pediatrician", bio="Caring and experienced child specialist."),
            models.Doctor(name="Dr. Bilal Yasin", specialty="Neurologist", bio="Specializes in brain and nervous system disorders."),
        ]
        db.add_all(doctors)
        db.commit()
        print("Database seeded with initial doctors.")
    else:
        print("Database already has doctors. Skipping seed.")
        
    db.close()

if __name__ == "__main__":
    seed()
