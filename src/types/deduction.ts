export type DeductionCalculationMethod = "Fixed Amount" | "Percentage of Basic Salary" | "Percentage of Gross Salary" | "Manual Entry";

export interface DeductionType {
    id: string;
    code: string;
    name: string;
    description: string;
    calculationMethod: DeductionCalculationMethod;
    defaultValue?: number;
    statutory: boolean;
    recurring: boolean;
    active: boolean;
}