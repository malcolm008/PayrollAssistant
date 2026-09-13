import { createContext } from "react";

import type { JobTitle } from "../types/jobTItle";

export interface JobTitleContextValue {
    jobTitles: JobTitle[];
    createJobTitle: (
        jobTitle: Omit<JobTitle, "id">
    ) => void;
    updateJobTitle: (
        id: string,
        updates: Partial<JobTitle>,
    ) => void;
    deleteJobTitle: (id: string) =>  void;
    toggleJobTitle: (id: string) => void;
}

export const JobTitleContext = createContext<JobTitleContextValue | undefined>(undefined);