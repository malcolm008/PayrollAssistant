export interface TerminationSettlement {
    noticePayment: number;

    normalOtHours: number;
    normalOtAmount: number;

    sundayPublicOtHours: number;
    sundayPublicOtAmount: number;

    outstandingLeaveDays: number;
    leavePay: number;
    leaveAllowance: number;

    basicPay: number;
    houseAllowance: number;
    responsibilityAllowance: number;
    utilityAllowance: number;

    otherNonTaxableAllowance: number;
    arrears: number;
    bonus: number;

    grossPay: number;
    taxableGross: number;

    pension: number;
    paye: number;

    salaryAdvance: number;
    outstandingLoans: number;
    otherDeduction: number;

    totalDeduction: number;
    takeHome: number;

    exchangeRate: number;
    pensionType: string;
}

export interface EmployeeTermination {
    id: string;
    
    employeeId: string;
    employeeNumber: string;

    employeeName: string;
    department: string;
    costCode: string;

    employmentDate: string;
    terminationDate: string;
    reason: string;

    settlement: TerminationSettlement;

    terminatedAt: string;
}