import { useForm } from '@inertiajs/react';
import { Home, Loader2 } from 'lucide-react';
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

type HouseStatus =
    'rent' | 'owned' | 'living_together_with_parents' | 'others' | 'separated';

type HouseholdFormData = {
    fathers_name: string;
    mothers_name: string;
    fathers_occupation: string;
    mothers_occupation: string;
    home_address: string;
    family_income: string;
    house_status: HouseStatus | '';
};

type Props = {
    onSubmit: (form: ReturnType<typeof useForm<HouseholdFormData>>) => void;
    initialData?: Partial<HouseholdFormData>;
    submitLabel?: string;
};

const HOUSE_STATUS_OPTIONS: { value: HouseStatus; label: string }[] = [
    { value: 'rent', label: 'Renting' },
    { value: 'owned', label: 'Owned' },
    { value: 'living_together_with_parents', label: 'Living with Parents' },
    { value: 'others', label: 'Others' },
    { value: 'separated', label: 'Separated' },
];

export function HouseholdForm({
    onSubmit,
    initialData = {},
    submitLabel = 'Save',
}: Props) {
    const form = useForm<HouseholdFormData>({
        fathers_name: initialData.fathers_name ?? '',
        mothers_name: initialData.mothers_name ?? '',
        fathers_occupation: initialData.fathers_occupation ?? '',
        mothers_occupation: initialData.mothers_occupation ?? '',
        home_address: initialData.home_address ?? '',
        family_income: initialData.family_income ?? '',
        house_status: (initialData.house_status as HouseStatus) ?? '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(form);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Parents Section */}
            <div className="rounded-xl border border-sidebar-border/70 bg-card p-6 dark:border-sidebar-border">
                <div className="mb-5 flex items-center gap-2">
                    <Home className="size-4 text-muted-foreground" />
                    <h2 className="font-semibold">Parent Information</h2>
                </div>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    {/* Father's Name */}
                    <div className="space-y-1.5">
                        <Label htmlFor="fathers_name">Father's Name</Label>
                        <Input
                            id="fathers_name"
                            value={form.data.fathers_name}
                            onChange={(e) =>
                                form.setData('fathers_name', e.target.value)
                            }
                            placeholder="e.g. Juan dela Cruz"
                            autoComplete="off"
                        />
                        <InputError message={form.errors.fathers_name} />
                    </div>

                    {/* Mother's Name */}
                    <div className="space-y-1.5">
                        <Label htmlFor="mothers_name">Mother's Name</Label>
                        <Input
                            id="mothers_name"
                            value={form.data.mothers_name}
                            onChange={(e) =>
                                form.setData('mothers_name', e.target.value)
                            }
                            placeholder="e.g. Maria dela Cruz"
                            autoComplete="off"
                        />
                        <InputError message={form.errors.mothers_name} />
                    </div>

                    {/* Father's Occupation */}
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
                        <InputError message={form.errors.fathers_occupation} />
                    </div>

                    {/* Mother's Occupation */}
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
                        <InputError message={form.errors.mothers_occupation} />
                    </div>
                </div>
            </div>

            {/* Housing Section */}
            <div className="rounded-xl border border-sidebar-border/70 bg-card p-6 dark:border-sidebar-border">
                <div className="mb-5 flex items-center gap-2">
                    <Home className="size-4 text-muted-foreground" />
                    <h2 className="font-semibold">
                        Housing & Financial Details
                    </h2>
                </div>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    {/* Home Address */}
                    <div className="space-y-1.5 md:col-span-2">
                        <Label htmlFor="home_address">Home Address</Label>
                        <Input
                            id="home_address"
                            value={form.data.home_address}
                            onChange={(e) =>
                                form.setData('home_address', e.target.value)
                            }
                            placeholder="e.g. 123 Rizal St., Brgy. San Jose, Manila"
                        />
                        <InputError message={form.errors.home_address} />
                    </div>

                    {/* Family Income */}
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
                                form.setData('family_income', e.target.value)
                            }
                            placeholder="e.g. 25000.00"
                        />
                        <InputError message={form.errors.family_income} />
                    </div>

                    {/* House Status */}
                    <div className="space-y-1.5">
                        <Label htmlFor="house_status">House Status</Label>
                        <Select
                            value={form.data.house_status}
                            onValueChange={(val) =>
                                form.setData('house_status', val as HouseStatus)
                            }
                        >
                            <SelectTrigger id="house_status">
                                <SelectValue placeholder="Select status..." />
                            </SelectTrigger>
                            <SelectContent>
                                {HOUSE_STATUS_OPTIONS.map((opt) => (
                                    <SelectItem
                                        key={opt.value}
                                        value={opt.value}
                                    >
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={form.errors.house_status} />
                    </div>
                </div>
            </div>

            {/* Submit */}
            <Button
                type="submit"
                disabled={form.processing}
                className="w-full sm:w-auto"
            >
                {form.processing && <Loader2 className="size-4 animate-spin" />}
                {submitLabel}
            </Button>
        </form>
    );
}
