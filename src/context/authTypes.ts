export interface User {
    id: string;
    name: string;
    username: string;
    role: string;
}

export interface Company {
    id: string;
    name: string;
    code: string;
}

export interface AuthContextType {
    user: User | null;
    company: Company | null;
    isAuthenticated: boolean;
    login: (
        username: string,
        password: string,
    ) => Promise<boolean>;
    logout: () => void;
    selectCompany: (company: Company) => void;
}