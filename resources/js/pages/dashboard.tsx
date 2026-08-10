import { Head, Link } from '@inertiajs/react';
import {
    Eye,
    Home,
    PhilippinePeso,
    TrendingUp,
    UserCheck,
    Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes';
import { show as showHousehold } from '@/routes/household';

// ─── Types ─────────────────────────────────────────────────────────────────

type HouseStatus =
    'rent' | 'owned' | 'living_together_with_parents' | 'others' | 'separated';
type Gender = 'male' | 'female' | 'other';

type Stats = {
    total_households: number;
    total_members: number;
    average_income: number;
    house_status_stats: Record<HouseStatus, number>;
    gender_stats: Record<Gender, number>;
};

type HouseholdRow = {
    id: number;
    fathers_name: string;
    mothers_name: string;
    fathers_occupation: string;
    mothers_occupation: string;
    home_address: string;
    family_income: string;
    house_status: HouseStatus;
    created_at: string;
    members_count?: number;
};

type Props = {
    stats: Stats;
    latest_households: HouseholdRow[];
};

const HOUSE_STATUS_LABELS: Record<HouseStatus, string> = {
    rent: 'Renting',
    owned: 'Owned',
    living_together_with_parents: 'Living with Parents',
    others: 'Others',
    separated: 'Separated',
};

const HOUSE_STATUS_BAR_COLORS: Record<HouseStatus, string> = {
    rent: 'bg-blue-500 dark:bg-blue-600',
    owned: 'bg-green-500 dark:bg-green-600',
    living_together_with_parents: 'bg-purple-500 dark:bg-purple-600',
    others: 'bg-yellow-500 dark:bg-yellow-600',
    separated: 'bg-red-500 dark:bg-red-600',
};

// ─── Component ──────────────────────────────────────────────────────────────

export default function Dashboard({ stats, latest_households }: Props) {
    const formattedAvgIncome = Number(stats.average_income).toLocaleString(
        'en-PH',
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        },
    );

    // Calculations for status stats percentages
    const statusTotal =
        Object.values(stats.house_status_stats).reduce((a, b) => a + b, 0) || 1;
    const genderTotal =
        Object.values(stats.gender_stats).reduce((a, b) => a + b, 0) || 1;

    return (
        <>
            <Head title="Dashboard" />

            <div className="flex flex-1 flex-col gap-6 p-6">
                {/* ── Page Header ── */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            System Dashboard
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Real-time overview of registered households and
                            member demographics.
                        </p>
                    </div>
                </div>

                {/* ── Metric Cards ── */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {/* Total Households */}
                    <div className="flex items-center justify-between rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm dark:border-sidebar-border">
                        <div className="space-y-1">
                            <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                Total Households
                            </span>
                            <div className="text-3xl font-bold">
                                {stats.total_households}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Registered household units
                            </p>
                        </div>
                        <div className="flex size-12 items-center justify-center rounded-xl bg-blue-100/60 dark:bg-blue-900/20">
                            <Home className="size-6 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>

                    {/* Total Members */}
                    <div className="flex items-center justify-between rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm dark:border-sidebar-border">
                        <div className="space-y-1">
                            <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                Total Members
                            </span>
                            <div className="text-3xl font-bold">
                                {stats.total_members}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Registered individuals
                            </p>
                        </div>
                        <div className="flex size-12 items-center justify-center rounded-xl bg-purple-100/60 dark:bg-purple-900/20">
                            <Users className="size-6 text-purple-600 dark:text-purple-400" />
                        </div>
                    </div>

                    {/* Average income */}
                    <div className="flex items-center justify-between rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm sm:col-span-2 lg:col-span-1 dark:border-sidebar-border">
                        <div className="space-y-1">
                            <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                Avg. Monthly Income
                            </span>
                            <div className="font-mono text-3xl font-bold">
                                ₱{formattedAvgIncome}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Estimated average per unit
                            </p>
                        </div>
                        <div className="flex size-12 items-center justify-center rounded-xl bg-emerald-100/60 dark:bg-emerald-900/20">
                            <PhilippinePeso className="size-6 text-emerald-600 dark:text-emerald-400" />
                        </div>
                    </div>
                </div>

                {/* ── Demographic Metrics ── */}
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Housing Status Stats */}
                    <div className="flex flex-col justify-between rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm dark:border-sidebar-border">
                        <div>
                            <div className="mb-4 flex items-center justify-between border-b border-sidebar-border/30 pb-3">
                                <h3 className="flex items-center gap-2 text-sm font-semibold">
                                    <Home className="size-4 text-muted-foreground" />
                                    Housing Occupancy Status
                                </h3>
                                <TrendingUp className="size-4 text-muted-foreground" />
                            </div>

                            <div className="space-y-4">
                                {(
                                    Object.keys(
                                        stats.house_status_stats,
                                    ) as HouseStatus[]
                                ).map((status) => {
                                    const count =
                                        stats.house_status_stats[status];
                                    const pct = Math.round(
                                        (count / statusTotal) * 100,
                                    );
                                    return (
                                        <div key={status} className="space-y-1">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="font-medium text-foreground">
                                                    {
                                                        HOUSE_STATUS_LABELS[
                                                            status
                                                        ]
                                                    }
                                                </span>
                                                <span className="text-muted-foreground">
                                                    {count} ({pct}%)
                                                </span>
                                            </div>
                                            <div className="h-2 w-full overflow-hidden rounded bg-muted">
                                                <div
                                                    className={`h-full ${HOUSE_STATUS_BAR_COLORS[status]}`}
                                                    style={{ width: `${pct}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Member Gender Demographics */}
                    <div className="flex flex-col justify-between rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm dark:border-sidebar-border">
                        <div>
                            <div className="mb-4 flex items-center justify-between border-b border-sidebar-border/30 pb-3">
                                <h3 className="flex items-center gap-2 text-sm font-semibold">
                                    <UserCheck className="size-4 text-muted-foreground" />
                                    Members Gender Mix
                                </h3>
                                <Users className="size-4 text-muted-foreground" />
                            </div>

                            {stats.total_members === 0 ? (
                                <p className="py-10 text-center text-sm text-muted-foreground">
                                    No member data available.
                                </p>
                            ) : (
                                <div className="space-y-5">
                                    {/* Male Percentage */}
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="font-medium text-sky-600 dark:text-sky-400">
                                                Male
                                            </span>
                                            <span className="text-muted-foreground">
                                                {stats.gender_stats.male} (
                                                {Math.round(
                                                    (stats.gender_stats.male /
                                                        genderTotal) *
                                                        100,
                                                )}
                                                %)
                                            </span>
                                        </div>
                                        <div className="h-2.5 w-full overflow-hidden rounded bg-muted">
                                            <div
                                                className="h-full bg-sky-500"
                                                style={{
                                                    width: `${Math.round((stats.gender_stats.male / genderTotal) * 100)}%`,
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Female Percentage */}
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="font-medium text-pink-600 dark:text-pink-400">
                                                Female
                                            </span>
                                            <span className="text-muted-foreground">
                                                {stats.gender_stats.female} (
                                                {Math.round(
                                                    (stats.gender_stats.female /
                                                        genderTotal) *
                                                        100,
                                                )}
                                                %)
                                            </span>
                                        </div>
                                        <div className="h-2.5 w-full overflow-hidden rounded bg-muted">
                                            <div
                                                className="h-full bg-pink-500"
                                                style={{
                                                    width: `${Math.round((stats.gender_stats.female / genderTotal) * 100)}%`,
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Other Percentage */}
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="font-medium text-slate-500 dark:text-slate-400">
                                                Other
                                            </span>
                                            <span className="text-muted-foreground">
                                                {stats.gender_stats.other} (
                                                {Math.round(
                                                    (stats.gender_stats.other /
                                                        genderTotal) *
                                                        100,
                                                )}
                                                %)
                                            </span>
                                        </div>
                                        <div className="h-2.5 w-full overflow-hidden rounded bg-muted">
                                            <div
                                                className="h-full bg-slate-400"
                                                style={{
                                                    width: `${Math.round((stats.gender_stats.other / genderTotal) * 100)}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── Recent Households ── */}
                <div className="rounded-xl border border-sidebar-border/70 bg-card shadow-sm dark:border-sidebar-border">
                    <div className="flex items-center justify-between p-6 pb-4">
                        <h3 className="flex items-center gap-2 text-sm font-semibold">
                            <Home className="size-4 text-muted-foreground" />
                            Recently Added Households
                        </h3>
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/household">View All Directory</Link>
                        </Button>
                    </div>

                    {latest_households.length === 0 ? (
                        <div className="flex flex-col items-center justify-center gap-2 py-10 text-muted-foreground">
                            <Home className="size-10 opacity-30" />
                            <p className="text-sm font-medium">
                                No records found
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto border-t border-sidebar-border/40">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-muted/40">
                                        <th className="px-6 py-3 text-left font-semibold text-muted-foreground">
                                            Father's Name
                                        </th>
                                        <th className="px-6 py-3 text-left font-semibold text-muted-foreground">
                                            Mother's Name
                                        </th>
                                        <th className="px-6 py-3 text-left font-semibold text-muted-foreground">
                                            Total Members
                                        </th>
                                        <th className="px-6 py-3 text-left font-semibold text-muted-foreground">
                                            Family Income
                                        </th>
                                        <th className="px-6 py-3 text-right font-semibold text-muted-foreground">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-sidebar-border/30">
                                    {latest_households.map((h) => (
                                        <tr
                                            key={h.id}
                                            className="transition-colors hover:bg-muted/20"
                                        >
                                            <td className="px-6 py-3.5 font-medium">
                                                {h.fathers_name}
                                            </td>
                                            <td className="px-6 py-3.5">
                                                {h.mothers_name}
                                            </td>
                                            <td className="px-6 py-3.5 text-muted-foreground">
                                                {h.members_count ?? 0} member
                                                {h.members_count !== 1
                                                    ? 's'
                                                    : ''}
                                            </td>
                                            <td className="px-6 py-3.5 font-mono text-xs">
                                                ₱
                                                {Number(
                                                    h.family_income,
                                                ).toLocaleString('en-PH', {
                                                    minimumFractionDigits: 2,
                                                })}
                                            </td>
                                            <td className="px-6 py-3.5">
                                                <div className="flex items-center justify-end">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        asChild
                                                        className="size-8"
                                                    >
                                                        <Link
                                                            href={
                                                                showHousehold({
                                                                    household:
                                                                        h.id,
                                                                }).url
                                                            }
                                                        >
                                                            <Eye className="size-4" />
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
