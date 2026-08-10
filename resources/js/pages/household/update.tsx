import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, FilePen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { index, update } from '@/routes/household';
import { HouseholdForm } from './_HouseholdForm';

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
};

export default function Edit({ household }: { household: Household }) {
    return (
        <>
            <Head title={`Edit Household #${household.id}`} />

            <div className="flex max-w-3xl flex-1 flex-col gap-6 p-6">
                {/* Header */}
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

                <HouseholdForm
                    submitLabel="Update Household"
                    initialData={{
                        fathers_name: household.fathers_name,
                        mothers_name: household.mothers_name,
                        fathers_occupation: household.fathers_occupation,
                        mothers_occupation: household.mothers_occupation,
                        home_address: household.home_address,
                        family_income: household.family_income,
                        house_status: household.house_status,
                    }}
                    onSubmit={(form) => {
                        form.patch(update({ household: household.id }).url);
                    }}
                />
            </div>
        </>
    );
}
