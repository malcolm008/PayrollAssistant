import {
    Download,
    Filter,
    Plus,
    Search,
    Users,
} from "lucide-react";

import { useState } from "react";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";

interface Employee {
    id: string,
    employeeNumber: string;
    name: string;
    department: string;
    position: string;
    employmentType: string;
    status: "Active" | "Inactive";
}

const employees: Employee[] = [
  {
    id: "1",
    employeeNumber: "EMP-0001",
    name: "John Mwangi",
    department: "Finance",
    position: "Accountant",
    employmentType: "Full Time",
    status: "Active",
  },
  {
    id: "2",
    employeeNumber: "EMP-0002",
    name: "Sarah Johnson",
    department: "Human Resources",
    position: "HR Manager",
    employmentType: "Full Time",
    status: "Active",
  },
  {
    id: "3",
    employeeNumber: "EMP-0003",
    name: "Michael Smith",
    department: "Information Technology",
    position: "Software Engineer",
    employmentType: "Full Time",
    status: "Active",
  },
  {
    id: "4",
    employeeNumber: "EMP-0004",
    name: "Amina Hassan",
    department: "Administration",
    position: "Administrator",
    employmentType: "Full Time",
    status: "Inactive",
  },
];

export function EmployeesPage() {
    const [ search, setSearch ] = useState("");

    const filteredEmployees = employees.filter((employee) => {
        const query = search.toLowerCase();
        
        return (
            employee.name.toLowerCase().includes(query) ||
            employee.employeeNumber
                .toLowerCase()
                .includes(query) ||
            employee.department.toLowerCase().includes(query) ||
            employee.position.toLowerCase().includes(query)
        );
    });

    return (
        <div className="space-y-6">

        {/* Page header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div>
            <div className="mb-2 flex items-center gap-2 text-xs text-[#666666]">
                <Users size={14} />
                Workforce
            </div>

            <h1 className="text-2xl font-semibold tracking-tight">
                Employees
            </h1>

            <p className="mt-1 text-sm text-[#666666]">
                Manage employee records and workforce information.
            </p>
            </div>

            <div className="flex gap-3">
            <Button variant="secondary">
                <Download size={16} />
                Export
            </Button>

            <Button>
                <Plus size={16} />
                Add Employee
            </Button>
            </div>

        </div>

        {/* Statistics */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <Card className="p-5">
            <p className="text-xs text-[#666666]">
                Total Employees
            </p>

            <p className="mt-2 text-2xl font-semibold">
                {employees.length}
            </p>
            </Card>

            <Card className="p-5">
            <p className="text-xs text-[#666666]">
                Active
            </p>

            <p className="mt-2 text-2xl font-semibold text-[#d4af37]">
                {
                employees.filter(
                    (employee) =>
                    employee.status === "Active",
                ).length
                }
            </p>
            </Card>

            <Card className="p-5">
            <p className="text-xs text-[#666666]">
                Inactive
            </p>

            <p className="mt-2 text-2xl font-semibold">
                {
                employees.filter(
                    (employee) =>
                    employee.status === "Inactive",
                ).length
                }
            </p>
            </Card>

            <Card className="p-5">
            <p className="text-xs text-[#666666]">
                Departments
            </p>

            <p className="mt-2 text-2xl font-semibold">
                {new Set(
                employees.map(
                    (employee) => employee.department,
                ),
                ).size}
            </p>
            </Card>

        </div>

        {/* Employee table */}
        <Card className="overflow-hidden">

            {/* Toolbar */}
            <div className="flex flex-col gap-3 border-b border-[#202020] p-5 lg:flex-row lg:items-center lg:justify-between">

            <div className="relative w-full lg:max-w-sm">

                <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#555555]"
                />

                <Input
                placeholder="Search employees..."
                value={search}
                onChange={(event) =>
                    setSearch(event.target.value)
                }
                className="pl-10"
                />

            </div>

            <Button variant="secondary">
                <Filter size={16} />
                Filters
            </Button>

            </div>

            {/* Table */}
            <div className="overflow-x-auto">

            <table className="w-full text-left">

                <thead>
                <tr className="border-b border-[#202020] text-[10px] uppercase tracking-[0.15em] text-[#555555]">
                    <th className="px-5 py-4 font-medium">
                    Employee
                    </th>

                    <th className="px-5 py-4 font-medium">
                    Department
                    </th>

                    <th className="px-5 py-4 font-medium">
                    Position
                    </th>

                    <th className="px-5 py-4 font-medium">
                    Employment
                    </th>

                    <th className="px-5 py-4 font-medium">
                    Status
                    </th>
                </tr>
                </thead>

                <tbody className="divide-y divide-[#202020]">

                {filteredEmployees.map((employee) => (

                    <tr
                    key={employee.id}
                    className="transition-colors hover:bg-[#151515]"
                    >

                    <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#d4af37]/10 text-xs font-bold text-[#d4af37]">
                            {employee.name
                            .split(" ")
                            .map((name) => name[0])
                            .join("")
                            .slice(0, 2)}
                        </div>

                        <div>
                            <p className="text-sm font-medium">
                            {employee.name}
                            </p>

                            <p className="mt-0.5 text-xs text-[#555555]">
                            {employee.employeeNumber}
                            </p>
                        </div>

                        </div>

                    </td>

                    <td className="px-5 py-4 text-sm text-[#999999]">
                        {employee.department}
                    </td>

                    <td className="px-5 py-4 text-sm text-[#999999]">
                        {employee.position}
                    </td>

                    <td className="px-5 py-4 text-sm text-[#999999]">
                        {employee.employmentType}
                    </td>

                    <td className="px-5 py-4">

                        <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-medium ${
                            employee.status === "Active"
                            ? "bg-[#d4af37]/10 text-[#d4af37]"
                            : "bg-[#555555]/10 text-[#777777]"
                        }`}
                        >
                        {employee.status}
                        </span>

                    </td>

                    </tr>

                ))}

                </tbody>

            </table>

            </div>

            {/* Empty state */}
            {filteredEmployees.length === 0 && (
            <div className="p-12 text-center">

                <Users
                size={28}
                className="mx-auto text-[#444444]"
                />

                <p className="mt-4 text-sm font-medium">
                No employees found
                </p>

                <p className="mt-1 text-xs text-[#555555]">
                Try changing your search criteria.
                </p>

            </div>
            )}

        </Card>

        </div>
    );
}