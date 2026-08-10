import { Head, Link, router } from '@inertiajs/react';
import {
    ChevronLeft,
    ChevronRight,
    Eye,
    FilePen,
    Home,
    Plus,
    Trash2,
    Users,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { create, destroy, edit, show } from '@/routes/household';

type HouseStatus =
    'rent' | 'owned' | 'living_together_with_parents' | 'others' | 'separated';

type Household = {
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

type PaginationLink = { url: string | null; label: string; active: boolean };

type PaginatedHouseholds = {
    data: Household[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    next_page_url: string | null;
    prev_page_url: string | null;
    links: PaginationLink[];
};

const HOUSE_STATUS_LABELS: Record<HouseStatus, string> = {
    rent: 'Renting',
    owned: 'Owned',
    living_together_with_parents: 'With Parents',
    others: 'Others',
    separated: 'Separated',
};

const HOUSE_STATUS_COLORS: Record<HouseStatus, string> = {
    rent: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    owned: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    living_together_with_parents:
        'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    others: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
    separated: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
};

// Strip HTML entities from pagination labels (« »)
function cleanLabel(label: string): string {
    return label
        .replace(/&laquo;\s*/g, '')
        .replace(/\s*&raquo;/g, '')
        .trim();
}

// Only the numbered page links (skip first prev / last next wrappers)
function pageLinks(links: PaginationLink[]): PaginationLink[] {
    return links.slice(1, -1);
}

export default function Index({
    households,
}: {
    households: PaginatedHouseholds;
}) {
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const handleDelete = (id: number) => {
        toast.warning(
            'Are you sure you want to delete this household record?',
            {
                action: {
                    label: 'Delete',
                    onClick: () => {
                        setDeletingId(id);
                        router.delete(destroy({ household: id }).url, {
                            onFinish: () => setDeletingId(null),
                        });
                    },
                },
                duration: 6000,
            },
        );
    };

    const handlePerPageChange = (val: string) => {
        router.get('/household', { per_page: val }, { preserveState: true });
    };

    const hasPrev = !!households.prev_page_url;
    const hasNext = !!households.next_page_url;
    const numbered = pageLinks(households.links);

    return (
        <>
            <Head title="Households" />

            <div className="flex flex-1 flex-col gap-6 p-6">
                {/* ── Page Header ─────────────────────────────────── */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-sidebar-primary/10">
                            <Home className="size-5 text-sidebar-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">
                                Households
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                {households.total} total record
                                {households.total !== 1 ? 's' : ''}
                            </p>
                        </div>
                    </div>
                    <Button asChild>
                        <Link href={create().url}>
                            <Plus className="size-4" />
                            Add Household
                        </Link>
                    </Button>
                </div>

                {/* ── Table Card ──────────────────────────────────── */}
                <div className="overflow-hidden rounded-xl border border-sidebar-border/70 bg-card dark:border-sidebar-border">
                    {households.data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center gap-3 py-20 text-muted-foreground">
                            <Home className="size-12 opacity-30" />
                            <p className="text-lg font-medium">
                                No households yet
                            </p>
                            <p className="text-sm">
                                Click "Add Household" to create your first
                                record.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-sidebar-border/50 bg-muted/40">
                                        <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                                            #
                                        </th>
                                        <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                                            Father's Name
                                        </th>
                                        <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                                            Mother's Name
                                        </th>
                                        <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                                            Address
                                        </th>
                                        <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                                            Family Income
                                        </th>
                                        <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                                            House Status
                                        </th>
                                        <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                                            Total Members
                                        </th>
                                        <th className="px-4 py-3 text-right font-semibold text-muted-foreground">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-sidebar-border/30">
                                    {households.data.map((h) => (
                                        <tr
                                            key={h.id}
                                            className="group transition-colors hover:bg-muted/30"
                                        >
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {h.id}
                                            </td>
                                            <td className="px-4 py-3 font-medium">
                                                {h.fathers_name}
                                            </td>
                                            <td className="px-4 py-3">
                                                {h.mothers_name}
                                            </td>
                                            <td className="max-w-[200px] truncate px-4 py-3 text-muted-foreground">
                                                {h.home_address}
                                            </td>
                                            <td className="px-4 py-3 font-mono text-sm">
                                                ₱
                                                {Number(
                                                    h.family_income,
                                                ).toLocaleString('en-PH', {
                                                    minimumFractionDigits: 2,
                                                })}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${HOUSE_STATUS_COLORS[h.house_status]}`}
                                                >
                                                    {
                                                        HOUSE_STATUS_LABELS[
                                                            h.house_status
                                                        ]
                                                    }
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="inline-flex items-center gap-1 rounded-md border border-sidebar-border/30 bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">
                                                    <Users className="size-3.5" />
                                                    {h.members_count ?? 0}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        asChild
                                                        className="size-8"
                                                    >
                                                        <Link
                                                            href={
                                                                show({
                                                                    household:
                                                                        h.id,
                                                                }).url
                                                            }
                                                        >
                                                            <Eye className="size-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        asChild
                                                        className="size-8"
                                                    >
                                                        <Link
                                                            href={
                                                                edit({
                                                                    household:
                                                                        h.id,
                                                                }).url
                                                            }
                                                        >
                                                            <FilePen className="size-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="size-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                                        onClick={() =>
                                                            handleDelete(h.id)
                                                        }
                                                        disabled={
                                                            deletingId === h.id
                                                        }
                                                    >
                                                        <Trash2 className="size-4" />
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

                {/* ── Pagination bar ───────────────────────────────── */}
                {households.total > 0 && (
                    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-between">
                        {/* "Showing X – Y of Z records" + "Rows per page Selector" */}
                        <div className="order-2 flex flex-wrap items-center justify-center gap-4 sm:order-1 sm:justify-start">
                            <p className="text-sm text-muted-foreground">
                                {households.from !== null &&
                                households.to !== null ? (
                                    <>
                                        Showing{' '}
                                        <span className="font-medium text-foreground">
                                            {households.from}
                                        </span>
                                        {' – '}
                                        <span className="font-medium text-foreground">
                                            {households.to}
                                        </span>{' '}
                                        of{' '}
                                        <span className="font-medium text-foreground">
                                            {households.total}
                                        </span>{' '}
                                        records
                                    </>
                                ) : (
                                    'No records on this page'
                                )}
                            </p>

                            <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">
                                    Rows per page:
                                </span>
                                <Select
                                    value={String(households.per_page)}
                                    onValueChange={handlePerPageChange}
                                >
                                    <SelectTrigger className="h-8 w-[75px] bg-background">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent align="start">
                                        <SelectItem value="10">10</SelectItem>
                                        <SelectItem value="20">20</SelectItem>
                                        <SelectItem value="50">50</SelectItem>
                                        <SelectItem value="100">100</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Page controls — only rendered when multiple pages exist */}
                        {households.last_page > 1 && (
                            <div className="order-1 flex items-center gap-1 sm:order-2">
                                {/* ← Previous */}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={!hasPrev}
                                    asChild={hasPrev}
                                    className="gap-1 px-2.5"
                                >
                                    {hasPrev ? (
                                        <Link href={households.prev_page_url!}>
                                            <ChevronLeft className="size-4" />
                                            Prev
                                        </Link>
                                    ) : (
                                        <>
                                            <ChevronLeft className="size-4" />
                                            Prev
                                        </>
                                    )}
                                </Button>

                                {/* Numbered pages */}
                                {numbered.map((link, i) => {
                                    const label = cleanLabel(link.label);
                                    const isEllipsis = label === '...';

                                    if (isEllipsis) {
                                        return (
                                            <span
                                                key={i}
                                                className="flex size-8 items-center justify-center text-sm text-muted-foreground select-none"
                                            >
                                                …
                                            </span>
                                        );
                                    }

                                    return link.active ? (
                                        <Button
                                            key={i}
                                            variant="default"
                                            size="sm"
                                            className="size-8 p-0"
                                        >
                                            {label}
                                        </Button>
                                    ) : (
                                        <Button
                                            key={i}
                                            variant="outline"
                                            size="sm"
                                            asChild
                                            className="size-8 p-0"
                                        >
                                            <Link href={link.url!}>
                                                {label}
                                            </Link>
                                        </Button>
                                    );
                                })}

                                {/* Next → */}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={!hasNext}
                                    asChild={hasNext}
                                    className="gap-1 px-2.5"
                                >
                                    {hasNext ? (
                                        <Link href={households.next_page_url!}>
                                            Next
                                            <ChevronRight className="size-4" />
                                        </Link>
                                    ) : (
                                        <>
                                            Next
                                            <ChevronRight className="size-4" />
                                        </>
                                    )}
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}
