from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class DoctorBase(BaseModel):
    name: str
    specialty: str
    bio: Optional[str] = None
    image_url: Optional[str] = None

class DoctorCreate(DoctorBase):
    pass

class Doctor(DoctorBase):
    id: int

    class Config:
        orm_mode = True

class AppointmentBase(BaseModel):
    patient_name: str
    patient_symptoms: str
    doctor_id: int
    scheduled_time: datetime

class AppointmentCreate(AppointmentBase):
    pass

class Appointment(AppointmentBase):
    id: int
    meeting_link: Optional[str]
    is_completed: bool
    created_at: datetime
    doctor: Doctor

    class Config:
        orm_mode = True

class SymptomAnalysisRequest(BaseModel):
    symptoms: str

class SymptomAnalysisResponse(BaseModel):
    suggested_specialty: str
    explanation: str
