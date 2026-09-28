export interface TrainingEmployee {
    id: string;
    employeeNumber: string;
    name: string;
    department: string;
    position: string;
}

export interface TrainingCourse {
    id: string;
    courseName: string;
    trainingType: string;
    startingDate: string;
    endingDate: string;
    duration: number;
    organizer: string;
    chiefLecturer: string;
    location: string;
    expertiseNeeded: string;
    costs: number;
    numberOfTrainees: number;
    remarks: string;
    participantIds: string[];
    createdAt: string;
}

export const TRAINING_TYPES = [
    "Internal Training",
    "External Training",
    "Workshop",
    "Seminar",
    "Conference",
    "Certification",
    "Induction",
    "On-the-Job Training",
    "Other", 
];

export const emptyForm = {
    courseName: "",
    trainingType: "Internal Training",
    startingDate: "",
    endingDate: "",
    organizer: "",
    chiefLecturer: "",
    location: "",
    expertiseNeeded: "",
    costs: "",
    remarks: "",  
};

export const formatCurrency = (value: number) => new Intl.NumberFormat("en-TZ", {
    style: "currency",
    currency: "TZS",
    maximumFractionDigits: 0,
}).format(value);