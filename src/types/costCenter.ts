export interface CostCenter {
    id: string;
    code: string;
    name: string;
    description: string;
    active: boolean;
}

export type StatusFilter = "all" | "active" | "inactive";

export const matchesStatus = (filter: StatusFilter, active: boolean) => filter === "all" || (filter === "active" && active) ||(filter === "inactive" && !active);