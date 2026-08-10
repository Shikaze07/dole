import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Eye, FilePen, Plus, Trash2, UserCheck, Users } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { index, edit, destroy } from '@/routes/household';
import {
    create as createMember,
    edit as editMember,
    destroy as destroyMember,
} from '@/routes/household/members';

type HouseStatus = 'rent' | 'owned' | 'living_together_with_parents' | 'others' | 'separated';
type CivilStatus = 'single' | 'married' | 'widowed' | 'divorced' | 'separated';
type Gender = 'male' | 'female' | 'other';

type Member = {
    id: number;
    birth_date: string;
    age: number;
    gender: Gender;
    civil_status: CivilStatus;
};

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
    members: Member[];
};

const HOUSE_STATUS_LABELS: Record<HouseStatus, string> = {
    rent: 'Renting',
    owned: 'Owned',
    living_together_with_parents: 'Living with Parents',
    others: 'Others',
    separated: 'Separated',
};

const HOUSE_STATUS_COLORS: Record<HouseStatus, string> = {
    rent: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    owned: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    living_together_with_parents: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    others: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
    separated: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
};

const GENDER_LABELS: Record<Gender, string> = {
    male: 'Male',
    female: 'Female',
    other: 'Other',
};

const GENDER_COLORS: Record<Gender, string> = {
    male: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300',
    female: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
    other: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
};

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="grid grid-cols-[170px_1fr] gap-4 py-3 border-b border-sidebar-border/30 last:border-0">
            <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
            <dd className="text-sm">{value}</dd>
        </div>
    );
}

export default function Show({ household }: { household: Household }) {
    const [deletingHousehold, setDeletingHousehold] = useState(false);
    const [deletingMemberId, setDeletingMemberId] = useState<number | null>(null);

    const handleDeleteHousehold = () => {
        toast.warning('Are you sure you want to delete this household and all its members?', {
            action: {
                label: 'Delete',
                onClick: () => {
                    setDeletingHousehold(true);
                    router.delete(destroy({ household: household.id }).url, {
                        onFinish: () => setDeletingHousehold(false),
                    });
                },
            },
            duration: 6000,
        });
    };

    const handleDeleteMember = (memberId: number) => {
        toast.warning('Are you sure you want to remove this member from the household?', {
            action: {
                label: 'Remove',
                onClick: () => {
                    setDeletingMemberId(memberId);
                    router.delete(destroyMember({ household: household.id, member: memberId }).url, {
                        preserveScroll: true,
                        onFinish: () => setDeletingMemberId(null),
                    });
                },
            },
            duration: 6000,
        });
    };


    return (
        <>
            <Head title={`Household #${household.id}`} />

            <div className="flex flex-1 flex-col gap-6 p-6 max-w-4xl">

                {/* Page Header */}
                <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" asChild className="size-9">
                            <Link href={index().url}>
                                <ArrowLeft className="size-4" />
                            </Link>
                        </Button>
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-xl bg-sidebar-primary/10">
                                <Eye className="size-5 text-sidebar-primary" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight">
                                    Household #{household.id}
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    {household.fathers_name} &amp; {household.mothers_name}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href={edit({ household: household.id }).url}>
                                <FilePen className="size-4" />
                                Edit
                            </Link>
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteHousehold}
                            disabled={deletingHousehold}
                        >
                            <Trash2 className="size-4" />
                            Delete
                        </Button>
                    </div>
                </div>

                {/* Household Details Card */}
                <div className="rounded-xl border border-sidebar-border/70 bg-card p-6 dark:border-sidebar-border">
                    <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Household Details
                    </h2>
                    <dl>
                        <DetailRow label="Father's Name" value={household.fathers_name} />
                        <DetailRow label="Father's Occupation" value={household.fathers_occupation} />
                        <DetailRow label="Mother's Name" value={household.mothers_name} />
                        <DetailRow label="Mother's Occupation" value={household.mothers_occupation} />
                        <DetailRow label="Home Address" value={household.home_address} />
                        <DetailRow
                            label="Monthly Family Income"
                            value={
                                <span className="font-mono font-medium">
                                    ₱{Number(household.family_income).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                </span>
                            }
                        />
                        <DetailRow
                            label="House Status"
                            value={
                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${HOUSE_STATUS_COLORS[household.house_status]}`}>
                                    {HOUSE_STATUS_LABELS[household.house_status]}
                                </span>
                            }
                        />
                        <DetailRow
                            label="Registered On"
                            value={new Date(household.created_at).toLocaleDateString('en-PH', {
                                year: 'numeric', month: 'long', day: 'numeric',
                            })}
                        />
                    </dl>
                </div>

                {/* Members Card */}
                <div className="rounded-xl border border-sidebar-border/70 bg-card dark:border-sidebar-border">
                    {/* Members Header */}
                    <div className="flex items-center justify-between p-6 pb-4">
                        <div className="flex items-center gap-2">
                            <Users className="size-4 text-muted-foreground" />
                            <h2 className="font-semibold">
                                Members
                            </h2>
                            <span className="ml-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                                {household.members.length}
                            </span>
                        </div>
                        <Button asChild size="sm">
                            <Link href={createMember({ household: household.id }).url}>
                                <Plus className="size-4" />
                                Add Member
                            </Link>
                        </Button>
                    </div>

                    {/* Members Table */}
                    {household.members.length === 0 ? (
                        <div className="flex flex-col items-center justify-center gap-3 px-6 pb-10 pt-4 text-muted-foreground">
                            <div className="flex size-14 items-center justify-center rounded-full bg-muted">
                                <UserCheck className="size-6 opacity-50" />
                            </div>
                            <div className="text-center">
                                <p className="font-medium">No members yet</p>
                                <p className="text-sm">Click "Add Member" to register household members.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto border-t border-sidebar-border/40">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-muted/40">
                                        <th className="px-4 py-3 text-left font-semibold text-muted-foreground">#</th>
                                        <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Date of Birth</th>
                                        <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Age</th>
                                        <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Gender</th>
                                        <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Civil Status</th>
                                        <th className="px-4 py-3 text-right font-semibold text-muted-foreground">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-sidebar-border/30">
                                    {household.members.map((member, idx) => (
                                        <tr
                                            key={member.id}
                                            className="transition-colors hover:bg-muted/20"
                                        >
                                            <td className="px-4 py-3 text-muted-foreground">{idx + 1}</td>
                                            <td className="px-4 py-3 font-mono text-xs">{member.birth_date}</td>
                                            <td className="px-4 py-3 font-semibold">{member.age} yrs</td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${GENDER_COLORS[member.gender]}`}>
                                                    {GENDER_LABELS[member.gender]}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 capitalize">{member.civil_status}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        asChild
                                                        className="size-8"
                                                    >
                                                        <Link href={editMember({ household: household.id, member: member.id }).url}>
                                                            <FilePen className="size-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="size-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                                        onClick={() => handleDeleteMember(member.id)}
                                                        disabled={deletingMemberId === member.id}
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

            </div>
        </>
    );
}
