export type AllowanceCalculationMethod = "Fixed Amount" | "Percentage of Basic Salary" | "Percentage of Gross Salary" | "Manual Entry";

export interface AllowanceType {
    id: string;
    code: string;
    name: string;
    description: string;
    calculationMethod: AllowanceCalculationMethod;
    defaultValue?: number;
    taxable: boolean;
    recurring: boolean;
    active: boolean;
}