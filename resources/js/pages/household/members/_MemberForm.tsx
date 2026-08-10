import { useForm } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
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

type Gender = 'male' | 'female' | 'other';
type CivilStatus = 'single' | 'married' | 'widowed' | 'divorced' | 'separated';

export type MemberFormData = {
    birth_date: string;
    age: string;
    gender: Gender | '';
    civil_status: CivilStatus | '';
};

type Props = {
    onSubmit: (form: ReturnType<typeof useForm<MemberFormData>>) => void;
    initialData?: Partial<MemberFormData>;
    submitLabel?: string;
};

const GENDER_OPTIONS: { value: Gender; label: string }[] = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other / Prefer not to say' },
];

const CIVIL_STATUS_OPTIONS: { value: CivilStatus; label: string }[] = [
    { value: 'single', label: 'Single' },
    { value: 'married', label: 'Married' },
    { value: 'widowed', label: 'Widowed' },
    { value: 'divorced', label: 'Divorced' },
    { value: 'separated', label: 'Separated' },
];

export function MemberForm({ onSubmit, initialData = {}, submitLabel = 'Save Member' }: Props) {
    const form = useForm<MemberFormData>({
        birth_date: initialData.birth_date ?? '',
        age: initialData.age ?? '',
        gender: (initialData.gender as Gender) ?? '',
        civil_status: (initialData.civil_status as CivilStatus) ?? '',
    });

    const handleBirthDateChange = (value: string) => {
        form.setData('birth_date', value);
        if (value) {
            const today = new Date();
            const dob = new Date(value);
            let age = today.getFullYear() - dob.getFullYear();
            const m = today.getMonth() - dob.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
            if (age >= 0) form.setData('age', String(age));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(form);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="rounded-xl border border-sidebar-border/70 bg-card p-6 dark:border-sidebar-border">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    {/* Birthdate */}
                    <div className="space-y-1.5">
                        <Label htmlFor="birth_date">Date of Birth</Label>
                        <Input
                            id="birth_date"
                            type="date"
                            value={form.data.birth_date}
                            onChange={(e) => handleBirthDateChange(e.target.value)}
                            max={new Date().toISOString().split('T')[0]}
                        />
                        <InputError message={form.errors.birth_date} />
                    </div>

                    {/* Age */}
                    <div className="space-y-1.5">
                        <Label htmlFor="age">Age</Label>
                        <Input
                            id="age"
                            type="number"
                            min="0"
                            max="150"
                            value={form.data.age}
                            onChange={(e) => form.setData('age', e.target.value)}
                            placeholder="Auto-calculated from birthdate"
                        />
                        <InputError message={form.errors.age} />
                    </div>

                    {/* Gender */}
                    <div className="space-y-1.5">
                        <Label htmlFor="gender">Gender</Label>
                        <Select
                            value={form.data.gender}
                            onValueChange={(val) => form.setData('gender', val as Gender)}
                        >
                            <SelectTrigger id="gender">
                                <SelectValue placeholder="Select gender..." />
                            </SelectTrigger>
                            <SelectContent>
                                {GENDER_OPTIONS.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={form.errors.gender} />
                    </div>

                    {/* Civil Status */}
                    <div className="space-y-1.5">
                        <Label htmlFor="civil_status">Civil Status</Label>
                        <Select
                            value={form.data.civil_status}
                            onValueChange={(val) => form.setData('civil_status', val as CivilStatus)}
                        >
                            <SelectTrigger id="civil_status">
                                <SelectValue placeholder="Select status..." />
                            </SelectTrigger>
                            <SelectContent>
                                {CIVIL_STATUS_OPTIONS.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={form.errors.civil_status} />
                    </div>
                </div>
            </div>

            <Button type="submit" disabled={form.processing} className="w-full sm:w-auto">
                {form.processing && <Loader2 className="size-4 animate-spin" />}
                {submitLabel}
            </Button>
        </form>
    );
}
