from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import uuid

import models
import schemas
import database
import ai_agent

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Telemedicine API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "Welcome to Telemedicine API"}

# AI Agent Route
@app.post("/analyze-symptoms", response_model=schemas.SymptomAnalysisResponse)
def analyze_symptoms(request: schemas.SymptomAnalysisRequest):
    result = ai_agent.analyze_symptoms(request.symptoms)
    return result

# Doctor Routes
@app.post("/doctors", response_model=schemas.Doctor)
def create_doctor(doctor: schemas.DoctorCreate, db: Session = Depends(get_db)):
    db_doctor = models.Doctor(**doctor.dict())
    db.add(db_doctor)
    db.commit()
    db.refresh(db_doctor)
    return db_doctor

@app.get("/doctors", response_model=List[schemas.Doctor])
def get_doctors(specialty: str = None, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    query = db.query(models.Doctor)
    if specialty:
        query = query.filter(models.Doctor.specialty == specialty)
    return query.offset(skip).limit(limit).all()

# Appointment Routes
@app.post("/appointments", response_model=schemas.Appointment)
def create_appointment(appointment: schemas.AppointmentCreate, db: Session = Depends(get_db)):
    # Verify doctor exists
    doctor = db.query(models.Doctor).filter(models.Doctor.id == appointment.doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
        
    # In a real app, integrate with Daily.co or Jitsi API here to generate a meeting link
    # For now, we simulate a unique Jitsi room link
    room_name = f"telemed-{uuid.uuid4().hex[:8]}"
    meeting_link = f"https://meet.jit.si/{room_name}"
    
    db_appointment = models.Appointment(
        **appointment.dict(),
        meeting_link=meeting_link
    )
    db.add(db_appointment)
    db.commit()
    db.refresh(db_appointment)
    return db_appointment

@app.get("/appointments/{appointment_id}", response_model=schemas.Appointment)
def get_appointment(appointment_id: int, db: Session = Depends(get_db)):
    appointment = db.query(models.Appointment).filter(models.Appointment.id == appointment_id).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return appointment

@app.get("/doctors/{doctor_id}/appointments", response_model=List[schemas.Appointment])
def get_doctor_appointments(doctor_id: int, db: Session = Depends(get_db)):
    appointments = db.query(models.Appointment).filter(models.Appointment.doctor_id == doctor_id).all()
    return appointments
