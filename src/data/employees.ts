import type { Employee } from "../types/employees";

export const initialEmployees: Employee[] = [
  {
    id: "1",
    employeeNumber: "EMP-0001",
    surname: "Mwangi",
    name: "John",
    gender: "Male",
    dateOfBirth: "1990-04-15",

    employmentType: "Full Time",
    department: "Finance",
    costCode: "FIN-001",
    jobTitle: "Accountant",

    currency: "TZS",
    salary: 1500000,
    allowances: [],
    paidOvertime: true,

    email: "john.mwangi@example.com",
    phone: "+255 712 345 001",

    wcfNumber: "WCF-0001",
    nationalIdNumber: "",
    tinNumber: "",
    sdlExemption: false,

    residence: "Dar es Salaam",
    companyHouse: false,
    rentedHouseRentAmount: 0,

    leaveDaysEntitled: 28,

    status: "Active",
  },

  {
    id: "2",
    employeeNumber: "EMP-0002",
    surname: "Johnson",
    name: "Sarah",
    gender: "Female",
    dateOfBirth: "1987-09-21",

    employmentType: "Full Time",
    department: "Human Resources",
    costCode: "HR-001",
    jobTitle: "HR Manager",

    currency: "TZS",
    salary: 2200000,
    allowances: [],
    paidOvertime: false,

    email: "sarah.johnson@example.com",
    phone: "+255 712 345 002",

    wcfNumber: "WCF-0002",
    nationalIdNumber: "",
    tinNumber: "",
    sdlExemption: false,

    residence: "Dar es Salaam",
    companyHouse: false,
    rentedHouseRentAmount: 0,

    leaveDaysEntitled: 28,

    status: "Active",
  },

  {
    id: "3",
    employeeNumber: "EMP-0003",
    surname: "Smith",
    name: "Michael",
    gender: "Male",
    dateOfBirth: "1993-02-10",

    employmentType: "Full Time",
    department: "Information Technology",
    costCode: "IT-001",
    jobTitle: "Software Engineer",

    currency: "TZS",
    salary: 2800000,
    allowances: [],
    paidOvertime: true,

    email: "michael.smith@example.com",
    phone: "+255 712 345 003",

    wcfNumber: "WCF-0003",
    nationalIdNumber: "",
    tinNumber: "",
    sdlExemption: false,

    residence: "Dar es Salaam",
    companyHouse: false,
    rentedHouseRentAmount: 0,

    leaveDaysEntitled: 28,

    status: "Active",
  },

  {
    id: "4",
    employeeNumber: "EMP-0004",
    surname: "Hassan",
    name: "Amina",
    gender: "Female",
    dateOfBirth: "1991-11-03",

    employmentType: "Full Time",
    department: "Administration",
    costCode: "ADM-001",
    jobTitle: "Administrator",

    currency: "TZS",
    salary: 1200000,
    allowances: [],
    paidOvertime: false,

    email: "amina.hassan@example.com",
    phone: "+255 712 345 004",

    wcfNumber: "WCF-0004",
    nationalIdNumber: "",
    tinNumber: "",
    sdlExemption: false,

    residence: "Dar es Salaam",
    companyHouse: false,
    rentedHouseRentAmount: 0,

    leaveDaysEntitled: 28,

    status: "Inactive",
  },
];
