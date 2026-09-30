export interface PensionReceipt {
    id: string;
    payrollPeriod: string;
    nssfReceiptNumber: string;
    nssfReceiptDate: string;
    psssfReceiptNumber: string;
    psssfReceiptDate: string;
    companyPFReceiptNumber: string;
    companyPFReceiptDate: string;
    updatedAt: string;
}

export interface PensionReceiptsModalProps {
    payrollPeriod: string;
    onClose: () => void;
}

export const emptyForm = {
    nssfReceiptNumber: "",
    nssfReceiptDate: "",
    psssfReceiptNumber: "",
    psssfReceiptDate: "",
    companyPFReceiptNumber: "",
    companyPFReceiptDate: "",
};
