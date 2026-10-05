export interface BroadcastRecord {
    id: string;
    payrollPeriod: string;
    message: string;
    receipientCount: number;
    sentAt: string;
    status: "Sent";
}

export interface BroadcastEmployee {
    id: string;
    name: string;
    status: string;
}

export interface PayslipBroadcastModalProps {
    employees: BroadcastEmployee[];
    onClose: () => void;
}

