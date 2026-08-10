import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    CalendarDays,
    FilePen,
    Home,
    Loader2,
    Plus,
    Trash2,
    UserPlus,
    Users,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import InputError from '@/components/input-error';
import { index, update } from '@/routes/household';

// ─── Types ─────────────────────────────────────────────────────────────────

type HouseStatus =
    'rent' | 'owned' | 'living_together_with_parents' | 'others' | 'separated';
type Gender = 'male' | 'female' | 'other';
type CivilStatus = 'single' | 'married' | 'widowed' | 'divorced' | 'separated';

type MemberRow = {
    id?: number;
    child_name: string;
    birth_date: string;
    age: string;
    gender: Gender | '';
    civil_status: CivilStatus | '';
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
    members?: {
        id: number;
        child_name: string;
        birth_date: string;
        age: number;
        gender: Gender;
        civil_status: CivilStatus;
    }[];
};

type FormData = {
    fathers_name: string;
    mothers_name: string;
    fathers_occupation: string;
    mothers_occupation: string;
    home_address: string;
    family_income: string;
    house_status: HouseStatus | '';
    members: MemberRow[];
};

// ─── Constants ──────────────────────────────────────────────────────────────

const HOUSE_STATUS_OPTIONS: { value: HouseStatus; label: string }[] = [
    { value: 'rent', label: 'Renting' },
    { value: 'owned', label: 'Owned' },
    { value: 'living_together_with_parents', label: 'Living with Parents' },
    { value: 'others', label: 'Others' },
    { value: 'separated', label: 'Separated' },
];

const GENDER_OPTIONS: { value: Gender; label: string }[] = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
];

const CIVIL_STATUS_OPTIONS: { value: CivilStatus; label: string }[] = [
    { value: 'single', label: 'Single' },
    { value: 'married', label: 'Married' },
    { value: 'widowed', label: 'Widowed' },
    { value: 'divorced', label: 'Divorced' },
    { value: 'separated', label: 'Separated' },
];

const EMPTY_MEMBER: MemberRow = {
    child_name: '',
    birth_date: '',
    age: '',
    gender: '',
    civil_status: '',
};

// ─── Helper ─────────────────────────────────────────────────────────────────

function calcAge(dateStr: string): string {
    if (!dateStr) return '';
    const today = new Date();
    const dob = new Date(dateStr);
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
    return age >= 0 ? String(age) : '';
}

// ─── Section wrapper ─────────────────────────────────────────────────────────

function Section({
    icon: Icon,
    title,
    children,
}: {
    icon: React.ElementType;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-xl border border-sidebar-border/70 bg-card p-6 dark:border-sidebar-border">
            <div className="mb-5 flex items-center gap-2 border-b border-sidebar-border/30 pb-4">
                <Icon className="size-4 text-muted-foreground" />
                <h2 className="font-semibold">{title}</h2>
            </div>
            {children}
        </div>
    );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function Edit({ household }: { household: Household }) {
    const form = useForm<FormData>({
        fathers_name: household.fathers_name,
        mothers_name: household.mothers_name,
        fathers_occupation: household.fathers_occupation,
        mothers_occupation: household.mothers_occupation,
        home_address: household.home_address,
        family_income: household.family_income,
        house_status: household.house_status,
        members:
            household.members?.map((m) => ({
                id: m.id,
                child_name: m.child_name,
                birth_date: m.birth_date,
                age: String(m.age),
                gender: m.gender,
                civil_status: m.civil_status,
            })) ?? [],
    });

    // Update a single field within a member row
    function setMemberField(idx: number, key: keyof MemberRow, value: string) {
        const updated = form.data.members.map((m, i) => {
            if (i !== idx) return m;
            const next = { ...m, [key]: value };
            // Auto-calculate age from birthdate
            if (key === 'birth_date') next.age = calcAge(value);
            return next;
        });
        form.setData('members', updated);
    }

    function addMember() {
        form.setData('members', [...form.data.members, { ...EMPTY_MEMBER }]);
    }

    function removeMember(idx: number) {
        const removed = form.data.members[idx];
        const updated = form.data.members.filter((_, i) => i !== idx);
        form.setData('members', updated);

        toast.info('Member removed from form list.', {
            action: {
                label: 'Undo',
                onClick: () => {
                    const restored = [...updated];
                    restored.splice(idx, 0, removed);
                    form.setData('members', restored);
                },
            },
        });
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        // Inertia routing updates via put/patch
        form.patch(update({ household: household.id }).url);
    }

    const today = new Date().toISOString().split('T')[0];

    return (
        <>
            <Head title={`Edit Household #${household.id}`} />

            <div className="flex max-w-3xl flex-1 flex-col gap-6 p-6">
                {/* Page Header */}
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="size-9"
                    >
                        <Link href={index().url}>
                            <ArrowLeft className="size-4" />
                        </Link>
                    </Button>
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30">
                            <FilePen className="size-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">
                                Edit Household
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Updating record #{household.id} —{' '}
                                {household.fathers_name} &amp;{' '}
                                {household.mothers_name}
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* ── Parent Info ─────────────────────────────────── */}
                    <Section icon={Home} title="Parent Information">
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <div className="space-y-1.5">
                                <Label htmlFor="fathers_name">
                                    Father's Name
                                </Label>
                                <Input
                                    id="fathers_name"
                                    value={form.data.fathers_name}
                                    onChange={(e) =>
                                        form.setData(
                                            'fathers_name',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="e.g. Juan dela Cruz"
                                    autoComplete="off"
                                />
                                <InputError
                                    message={form.errors.fathers_name}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="mothers_name">
                                    Mother's Name
                                </Label>
                                <Input
                                    id="mothers_name"
                                    value={form.data.mothers_name}
                                    onChange={(e) =>
                                        form.setData(
                                            'mothers_name',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="e.g. Maria dela Cruz"
                                    autoComplete="off"
                                />
                                <InputError
                                    message={form.errors.mothers_name}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="fathers_occupation">
                                    Father's Occupation
                                </Label>
                                <Input
                                    id="fathers_occupation"
                                    value={form.data.fathers_occupation}
                                    onChange={(e) =>
                                        form.setData(
                                            'fathers_occupation',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="e.g. Engineer"
                                />
                                <InputError
                                    message={form.errors.fathers_occupation}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="mothers_occupation">
                                    Mother's Occupation
                                </Label>
                                <Input
                                    id="mothers_occupation"
                                    value={form.data.mothers_occupation}
                                    onChange={(e) =>
                                        form.setData(
                                            'mothers_occupation',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="e.g. Teacher"
                                />
                                <InputError
                                    message={form.errors.mothers_occupation}
                                />
                            </div>
                        </div>
                    </Section>

                    {/* ── Housing & Finances ──────────────────────────── */}
                    <Section icon={Home} title="Housing & Financial Details">
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <div className="space-y-1.5 md:col-span-2">
                                <Label htmlFor="home_address">
                                    Home Address
                                </Label>
                                <Input
                                    id="home_address"
                                    value={form.data.home_address}
                                    onChange={(e) =>
                                        form.setData(
                                            'home_address',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="e.g. 123 Rizal St., Brgy. San Jose, Manila"
                                />
                                <InputError
                                    message={form.errors.home_address}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="family_income">
                                    Monthly Family Income (₱)
                                </Label>
                                <Input
                                    id="family_income"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={form.data.family_income}
                                    onChange={(e) =>
                                        form.setData(
                                            'family_income',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="e.g. 25000.00"
                                />
                                <InputError
                                    message={form.errors.family_income}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="house_status">
                                    House Status
                                </Label>
                                <Select
                                    value={form.data.house_status}
                                    onValueChange={(v) =>
                                        form.setData(
                                            'house_status',
                                            v as HouseStatus,
                                        )
                                    }
                                >
                                    <SelectTrigger id="house_status">
                                        <SelectValue placeholder="Select status..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {HOUSE_STATUS_OPTIONS.map((o) => (
                                            <SelectItem
                                                key={o.value}
                                                value={o.value}
                                            >
                                                {o.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError
                                    message={form.errors.house_status}
                                />
                            </div>
                        </div>
                    </Section>

                    {/* ── Members ─────────────────────────────────────── */}
                    <div className="rounded-xl border border-sidebar-border/70 bg-card dark:border-sidebar-border">
                        {/* Members section header */}
                        <div className="flex items-center justify-between border-b border-sidebar-border/30 p-6 pb-4">
                            <div className="flex items-center gap-2">
                                <Users className="size-4 text-muted-foreground" />
                                <h2 className="font-semibold">
                                    Household Members
                                </h2>
                                {form.data.members.length > 0 && (
                                    <span className="ml-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                                        {form.data.members.length}
                                    </span>
                                )}
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={addMember}
                            >
                                <UserPlus className="size-4" />
                                Add Member
                            </Button>
                        </div>

                        {/* Empty state */}
                        {form.data.members.length === 0 ? (
                            <div className="flex flex-col items-center justify-center gap-3 py-10 text-muted-foreground">
                                <div className="flex size-14 items-center justify-center rounded-full bg-muted">
                                    <Users className="size-6 opacity-40" />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-medium">
                                        No members added yet
                                    </p>
                                    <p className="text-xs">
                                        Click "Add Member" to include household
                                        members.
                                    </p>
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={addMember}
                                >
                                    <Plus className="size-4" />
                                    Add First Member
                                </Button>
                            </div>
                        ) : (
                            <div className="divide-y divide-sidebar-border/30">
                                {form.data.members.map((member, idx) => (
                                    <div key={idx} className="p-5">
                                        <div className="mb-3 flex items-center justify-between">
                                            <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                                <CalendarDays className="size-3.5" />
                                                Member {idx + 1}
                                            </span>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="size-7 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                                onClick={() =>
                                                    removeMember(idx)
                                                }
                                            >
                                                <Trash2 className="size-3.5" />
                                            </Button>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                                            {/* Child's Name */}
                                            <div className="col-span-2 space-y-1.5 md:col-span-4">
                                                <Label
                                                    htmlFor={`member_child_name_${idx}`}
                                                >
                                                    Child's Name
                                                </Label>
                                                <Input
                                                    id={`member_child_name_${idx}`}
                                                    value={member.child_name}
                                                    onChange={(e) =>
                                                        setMemberField(
                                                            idx,
                                                            'child_name',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="e.g. Juan dela Cruz Jr."
                                                    autoComplete="off"
                                                />
                                                <InputError
                                                    message={
                                                        (
                                                            form.errors as Record<
                                                                string,
                                                                string
                                                            >
                                                        )[
                                                            `members.${idx}.child_name`
                                                        ]
                                                    }
                                                />
                                            </div>

                                            {/* Birthdate */}
                                            <div className="col-span-2 space-y-1.5 md:col-span-1">
                                                <Label
                                                    htmlFor={`member_birth_date_${idx}`}
                                                >
                                                    Date of Birth
                                                </Label>
                                                <Input
                                                    id={`member_birth_date_${idx}`}
                                                    type="date"
                                                    max={today}
                                                    value={member.birth_date}
                                                    onChange={(e) =>
                                                        setMemberField(
                                                            idx,
                                                            'birth_date',
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                                <InputError
                                                    message={
                                                        (
                                                            form.errors as Record<
                                                                string,
                                                                string
                                                            >
                                                        )[
                                                            `members.${idx}.birth_date`
                                                        ]
                                                    }
                                                />
                                            </div>

                                            {/* Age */}
                                            <div className="space-y-1.5">
                                                <Label
                                                    htmlFor={`member_age_${idx}`}
                                                >
                                                    Age
                                                </Label>
                                                <Input
                                                    id={`member_age_${idx}`}
                                                    type="number"
                                                    min="0"
                                                    max="150"
                                                    value={member.age}
                                                    onChange={(e) =>
                                                        setMemberField(
                                                            idx,
                                                            'age',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Auto"
                                                />
                                                <InputError
                                                    message={
                                                        (
                                                            form.errors as Record<
                                                                string,
                                                                string
                                                            >
                                                        )[`members.${idx}.age`]
                                                    }
                                                />
                                            </div>

                                            {/* Gender */}
                                            <div className="space-y-1.5">
                                                <Label
                                                    htmlFor={`member_gender_${idx}`}
                                                >
                                                    Gender
                                                </Label>
                                                <Select
                                                    value={member.gender}
                                                    onValueChange={(v) =>
                                                        setMemberField(
                                                            idx,
                                                            'gender',
                                                            v,
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger
                                                        id={`member_gender_${idx}`}
                                                    >
                                                        <SelectValue placeholder="Select..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {GENDER_OPTIONS.map(
                                                            (o) => (
                                                                <SelectItem
                                                                    key={
                                                                        o.value
                                                                    }
                                                                    value={
                                                                        o.value
                                                                    }
                                                                >
                                                                    {o.label}
                                                                </SelectItem>
                                                            ),
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                                <InputError
                                                    message={
                                                        (
                                                            form.errors as Record<
                                                                string,
                                                                string
                                                            >
                                                        )[
                                                            `members.${idx}.gender`
                                                        ]
                                                    }
                                                />
                                            </div>

                                            {/* Civil Status */}
                                            <div className="space-y-1.5">
                                                <Label
                                                    htmlFor={`member_civil_status_${idx}`}
                                                >
                                                    Civil Status
                                                </Label>
                                                <Select
                                                    value={member.civil_status}
                                                    onValueChange={(v) =>
                                                        setMemberField(
                                                            idx,
                                                            'civil_status',
                                                            v,
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger
                                                        id={`member_civil_status_${idx}`}
                                                    >
                                                        <SelectValue placeholder="Select..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {CIVIL_STATUS_OPTIONS.map(
                                                            (o) => (
                                                                <SelectItem
                                                                    key={
                                                                        o.value
                                                                    }
                                                                    value={
                                                                        o.value
                                                                    }
                                                                >
                                                                    {o.label}
                                                                </SelectItem>
                                                            ),
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                                <InputError
                                                    message={
                                                        (
                                                            form.errors as Record<
                                                                string,
                                                                string
                                                            >
                                                        )[
                                                            `members.${idx}.civil_status`
                                                        ]
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Add another row at the bottom */}
                                <div className="p-4">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="w-full border border-dashed border-sidebar-border/50 text-muted-foreground hover:text-foreground"
                                        onClick={addMember}
                                    >
                                        <Plus className="size-4" />
                                        Add Another Member
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ── Submit ──────────────────────────────────────── */}
                    <div className="flex items-center justify-between gap-4 rounded-xl border border-sidebar-border/45 bg-muted/30 px-5 py-4">
                        <p className="text-sm text-muted-foreground">
                            {form.data.members.length === 0
                                ? 'No members added.'
                                : `${form.data.members.length} member${form.data.members.length > 1 ? 's' : ''} will be saved with this household.`}
                        </p>
                        <Button
                            type="submit"
                            disabled={form.processing}
                            className="shrink-0"
                        >
                            {form.processing && (
                                <Loader2 className="size-4 animate-spin" />
                            )}
                            Update Household
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}
