import { 
    useCallback,
    useEffect,
    useState,
    type ReactNode,
} from "react";

import type { JobTitle } from "../types/jobTItle";
import { JobTitleContext } from "./jobTItleContext";

const DEFAULT_JOB_TITLES: JobTitle[] = [
    {
        id: "job-1",
        code: "MD",
        name: "Managing Director",
        description: "Head of the organization.",
        active: true,
    },
    {
        id: "job-2",
        code: "FIN-MGR",
        name: "Finance Manager",
        description: "Responsible for financial management.",
        active: true,
    },
    {
        id: "job-3",
        code: "HR-MGR",
        name: "HR Manager",
        description: "Responsible for human resources management.",
        active: true,
    },
    {
        id: "job-4",
        code: "ACC",
        name: "Accountant",
        description: "Responsible for accounting activities.",
        active: true,
    },
    {
        id: "job-5",
        code: "HR-OFF",
        name: "HR Officer",
        description: "Supports human resources operations.",
        active: true,
    },
    {
        id: "job-6",
        code: "DEV",
        name: "Software Developer",
        description: "Develops and maintains software systems.",
        active: true,
    },
];

const STORAGE_KEY = "payroll_job_titles";

function createId(prefix: string) {
    if (
        typeof crypto !== "undefined" && 
        typeof crypto.randomUUID === "function"
    ) {
        return `${prefix}-${crypto.randomUUID()}`;
    }

    return `${prefix}-${Date.now()}`;
}

export function JobTitleProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [jobTitles, setJobTitles] = useState<JobTitle[]>(
        () => {
        try {
            const stored =
            localStorage.getItem(STORAGE_KEY);

            if (stored) {
            return JSON.parse(stored);
            }
        } catch {
            // Ignore invalid localStorage data.
        }

        return DEFAULT_JOB_TITLES;
        },
    );

    useEffect(() => {
        localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(jobTitles),
        );
    }, [jobTitles]);

    const createJobTitle = useCallback(
        (jobTitle: Omit<JobTitle, "id">) => {
        setJobTitles((current) => [
            ...current,
            {
            ...jobTitle,
            id: createId("job"),
            },
        ]);
        },
        [],
    );

    const updateJobTitle = useCallback(
        (
        id: string,
        updates: Partial<JobTitle>,
        ) => {
        setJobTitles((current) =>
            current.map((item) =>
            item.id === id
                ? { ...item, ...updates }
                : item,
            ),
        );
        },
        [],
    );

    const deleteJobTitle = useCallback((id: string) => {
        setJobTitles((current) =>
        current.filter((item) => item.id !== id),
        );
    }, []);

    const toggleJobTitle = useCallback((id: string) => {
        setJobTitles((current) =>
        current.map((item) =>
            item.id === id
            ? { ...item, active: !item.active }
            : item,
        ),
        );
    }, []);

    return (
        <JobTitleContext.Provider
        value={{
            jobTitles,
            createJobTitle,
            updateJobTitle,
            deleteJobTitle,
            toggleJobTitle,
        }}
        >
        {children}
        </JobTitleContext.Provider>
    );
}