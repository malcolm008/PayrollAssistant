import {
  ChevronRight,
  Clock3,
  LayoutDashboard,
  Percent,
  Plus,
  Users,
  WalletCards,
  FileText,
  MessageSquareText,
  Calculator,
  Settings2,
  HatGlasses,
  HousePlus,
  ChartNetwork,
  RotateCwFadingClock,
} from "lucide-react";
import { useState } from "react";
import { GlobalIncrementModal, type IncrementEmployee } from "../features/modals/GlobalincrementModal";
import { IndividualIncrementModal } from "../features/modals/IndividualincrementModal";
import { DashboardLeaveWorkspace } from "../components/dashboard/dashboardLeaveWorkspace";
import { PensionReceiptsModal } from "../features/modals/PensionReceiptsModal";
import { PayslipBroadcastModal } from "../features/modals/PayslipBroadcastModal";
import { IncomeTaxParametersModal } from "../components/dashboard/incomeTaxParametersModal";
import { SystemUsersModal } from "../components/dashboard/systemUsersModal";
import { PayrollConfigPanel } from "../components/dashboard/payrollConfigPanel";
import { PaymentVariablesModal } from "../components/dashboard/PaymentVariablesModal";
import { CostCentersModal } from "../components/dashboard/costCenterModal";
import { AccountAllocationModal } from "../components/dashboard/accountAllocationModal";
import { GLAccountsModal } from "../components/dashboard/glAccountsModal";

const incrementEmployees: IncrementEmployee[] = [
  { id: "EMP-0001", name: "John Mwangi", department: "Finance", status: "Active", basicSalary: 1500000 },
  { id: "EMP-0002", name: "Sarah Johnson", department: "Human Resources", status: "Active", basicSalary: 2200000 },
  { id: "EMP-0003", name: "Michael Smith", department: "Information Technology", status: "Active", basicSalary: 2800000 },
  { id: "EMP-0004", name: "Amina Hassan", department: "Administration", status: "Active", basicSalary: 1200000 },
];

interface OperationTileProps {
  title: string;
  tag: string;
  icon: React.ElementType;
  onClick?: () => void;
  accent?: "blueGreen";
}

function OperationTile({
  title,
  tag,
  icon: Icon,
  onClick,
  accent = "blueGreen",
}: OperationTileProps) {
  const accentClasses = {
    blueGreen: {
      icon: "text-[color-mix(in_srgb,var(--color-success)_60%,var(--color-info))]",
      iconBg: "bg-[color-mix(in_srgb,var(--color-success)_60%,var(--color-info))]/10",
      hover: "group-hover:border-[color-mix(in_srgb,var(--color-success)_60%,var(--color-info))]/40",
    },
  };

  const styles = accentClasses[accent];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative flex min-h-[128px] w-full flex-col justify-between rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:bg-[var(--color-surface-hover)] hover:shadow-lg ${styles.hover}`}
    >
      <div className="flex items-start justify-between">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${styles.iconBg}`}
        >
          <Icon size={19} className={styles.icon} strokeWidth={1.8} />
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-sm font-semibold text-[var(--color-text)]">
          {title}
        </h3>

        <p className="mt-1 text-[11px] text-[var(--color-text-muted)]">
          {tag}
        </p>
      </div>
    </button>
  );
}

interface SectionHeaderProps {
  title: string;
  count?: number;
  action?: { label: string; onClick: () => void };
}

function SectionHeader({ title, count, action }: SectionHeaderProps) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <h2 className="text-sm font-semibold text-[var(--color-text)]">
          {title}
        </h2>

        {count !== undefined && (
          <span className="rounded-full bg-[var(--color-brand-soft)] px-2 py-0.5 text-[10px] font-semibold text-[var(--color-brand)]">
            {count}
          </span>
        )}
      </div>

      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="text-xs font-medium text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-brand)]"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

export function DashboardPage() {
  const [showGlobalIncrement, setShowGlobalIncrement] = useState(false);
  const [showIndividualIncrement, setShowIndividualIncrement] = useState(false);
  const [showLeaveWorkspace, setShowLeaveWorkspace] = useState(false);
  const [showPensionReceipts, setShowPensionReceipts] = useState(false);
  const [showPayslipBroadcast, setShowPayslipBroadcast] = useState(false);
  const [showIncomeTax, setShowIncomeTax] = useState(false);
  const [showSystemUsers, setShowSystemUsers] = useState(false);
  const [showPayrollConfig, setShowPayrollConfig] = useState(false);
  const [showPaymentVariable, setShowPaymentVariable] = useState(false)
  const [showCostCenters, setShowCostCenters] = useState(false);
  const [showGLAccounts, setShowGLAccounts] = useState(false);
  const [showAccountAllocation, setShowAccountAllocation] = useState(false);

  return (
    <div className="min-h-full bg-[var(--color-bg)]">
      <div className="mx-auto w-full max-w-[1800px] px-4 py-6 sm:px-6 lg:px-8">
        {/* =========================================================
            PAGE HEADER
        ========================================================= */}
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
              <LayoutDashboard size={14} />
              <span>Dashboard</span>
              <ChevronRight size={13} />
              <span className="text-[var(--color-text-secondary)]">
                Operations
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2">
            <Clock3 size={15} className="text-[var(--color-brand)]" />
            <span className="text-xs text-[var(--color-text-secondary)]">
              Payroll Period
            </span>
            <span className="text-xs font-semibold text-[var(--color-text)]">
              September 2026
            </span>
          </div>
        </div>

        {/* =========================================================
            MAIN GRID: Operations (left) + Increments (right rail)
        ========================================================= */}
        <div className="grid grid-cols-1 gap-10 xl:grid-cols-[1fr_320px]">
          <div>
            {/* Input Operations */}
            <section className="mb-10">
              <SectionHeader title="Input Operations" count={5} />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <OperationTile
                  title="Cost Centers"
                  tag="Setup"
                  icon={HatGlasses}
                  onClick={() => setShowCostCenters(true)}
                  accent="blueGreen"
                />
                <OperationTile
                  title="GL Accounts"
                  tag="Setup"
                  icon={HousePlus}
                  onClick={() => setShowGLAccounts(true)}
                  accent="blueGreen"
                />
                <OperationTile
                  title="Account Allocation"
                  tag="Accounting"
                  icon={ChartNetwork}
                  onClick={() => setShowAccountAllocation(true)}
                  accent="blueGreen"
                />
                <OperationTile
                  title="Leave"
                  tag="HR · Operations"
                  icon={RotateCwFadingClock}
                  onClick={() =>
                    setShowLeaveWorkspace((current) => !current)
                  }
                  accent="blueGreen"
                />
                <OperationTile
                  title="Payroll Configuration"
                  tag="Setup · Types"
                  icon={Settings2}
                  onClick={() => setShowPayrollConfig((current) => !current)}
                  accent="blueGreen"
                />                
              </div>
            </section>
            {showLeaveWorkspace && (
              <DashboardLeaveWorkspace />
            )}
            {showPayrollConfig && (
              <PayrollConfigPanel onClose={() => setShowPayrollConfig(false)} />
            )}
            {showPaymentVariable && (
              <PaymentVariablesModal onClose={() => setShowPaymentVariable(false)} />
            )}
            {showCostCenters && (
              <CostCentersModal onClose={() => setShowCostCenters(false)} />
            )}

            {showGLAccounts && (
              <GLAccountsModal onClose={() => setShowGLAccounts(false)} />
            )}

            {showAccountAllocation && (
              <AccountAllocationModal onClose={() => setShowAccountAllocation(false)} />
            )}
            {/* System Administration */}
            <section>
              <SectionHeader title="System Administration" />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <OperationTile
                    title="Income Tax Parameters"
                    tag="Setup · Statutory"
                    icon={Calculator}
                    onClick={() => setShowIncomeTax(true)}
                    accent="blueGreen"
                  />
                  <OperationTile
                    title="System Users"
                    tag="Access · Roles"
                    icon={Users}
                    onClick={() => setShowSystemUsers(true)}
                    accent="blueGreen"
                  />
                  <OperationTile
                    title="Payment Variables"
                    tag="Setup · Variables"
                    icon={WalletCards}
                    onClick={() => setShowPaymentVariable(true)}
                    accent="blueGreen"
                  />
                </div>
            </section>
          </div>

          {/* Right rail: Global Operations */}
          <aside>
            <SectionHeader title="Payroll Operations" count={2} />

            <div className="flex flex-col gap-3">
            <OperationTile
              title="Global Increment"
              tag="Payroll · Bulk"
              icon={Percent}
              onClick={() => setShowGlobalIncrement(true)}
              accent="blueGreen"
            />

            <OperationTile
              title="Individual Increment"
              tag="Payroll · Single"
              icon={Plus}
              onClick={() => setShowIndividualIncrement(true)}
              accent="blueGreen"
            />

            <OperationTile
              title="Pension Receipts"
              tag="Payroll · Statutory"
              icon={FileText}
              onClick={() => setShowPensionReceipts(true)}
              accent="blueGreen"
            />

            <OperationTile
              title="Payslip Broadcast"
              tag="Payroll · Employee Communication"
              icon={MessageSquareText}
              onClick={() => setShowPayslipBroadcast(true)}
              accent="blueGreen"
            />
            </div>

            {showGlobalIncrement && (
              <GlobalIncrementModal
                employees={incrementEmployees}
                onClose={() => setShowGlobalIncrement(false)}
                onApply={(payload) => {
                  console.log("Apply global increment", payload);
                  setShowGlobalIncrement(false);
                }}
              />
            )}

            {showIndividualIncrement && (
              <IndividualIncrementModal
                employees={incrementEmployees}
                onClose={() => setShowIndividualIncrement(false)}
                onApply={(payload) => {
                  console.log("Apply individual increment", payload);
                  setShowIndividualIncrement(false);
                }}
              />
            )}
            
            {showPensionReceipts && (
              <PensionReceiptsModal
                payrollPeriod="September 2026"
                onClose={() => setShowPensionReceipts(false)}
              />
            )}

            {showPayslipBroadcast && (
              <PayslipBroadcastModal
                employees={incrementEmployees}
                onClose={() => setShowPayslipBroadcast(false)}
              />
            )}

            {showIncomeTax && (
              <IncomeTaxParametersModal
                payrollPeriod="September 2026"
                onClose={() => setShowIncomeTax(false)}
                onSave={(bands) => {
                  console.log("Save tax bands", bands);
                  setShowIncomeTax(false);
                }}
              />
            )}
            {showSystemUsers && (
              <SystemUsersModal
                currentUserId="USR-0001"  // the signed-in user's id
                onClose={() => setShowSystemUsers(false)}
                onSaveUser={(user, password) => console.log("Save user", user, password)}
                onStatusChange={(user) => console.log("Status", user)}
              />
            )}
          </aside>
        </div>

        {/* =========================================================
            FOOTER STATUS
        ========================================================= */}
        <div className="mt-10 flex flex-col gap-2 border-t border-[var(--color-border)] pt-5 text-[10px] text-[var(--color-text-muted)] sm:flex-row sm:items-center sm:justify-between">
          <span>Payroll Management System</span>
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-success)]" />
            System operational
          </span>
        </div>
      </div>
    </div>
  );
}