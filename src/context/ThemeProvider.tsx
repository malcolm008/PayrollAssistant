import {
    useEffect,
    useState,
    type ReactNode,
} from "react";

import {
    ThemeContext,
    type Theme,
} from "./ThemeContext";

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setThemeState] = useState<Theme>(() => {
        const savedTheme = localStorage.getItem("payroll-theme");

        if (savedTheme === "dark" || savedTheme === "light") {
            return savedTheme;
        }

        return "dark";
    });

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("payroll-theme", theme);
    }, [theme]);

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
    };

    const toggleTheme = () => {
        setThemeState((current) => current === "dark" ? "light" : "dark");
    };

    return (
        <ThemeContext.Provider
            value={{
                theme,
                toggleTheme,
                setTheme,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
}