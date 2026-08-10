import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { show } from '@/routes/household';
import { store } from '@/routes/household/members';
import { MemberForm } from './_MemberForm';

type Household = {
    id: number;
    fathers_name: string;
    mothers_name: string;
};

export default function Create({ household }: { household: Household }) {
    return (
        <>
            <Head title={`Add Member — Household #${household.id}`} />

            <div className="flex max-w-2xl flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="size-9"
                    >
                        <Link href={show({ household: household.id }).url}>
                            <ArrowLeft className="size-4" />
                        </Link>
                    </Button>
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                            <UserPlus className="size-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">
                                Add Member
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Adding to: {household.fathers_name} &amp;{' '}
                                {household.mothers_name}
                            </p>
                        </div>
                    </div>
                </div>

                <MemberForm
                    submitLabel="Add Member"
                    onSubmit={(form) => {
                        form.post(store({ household: household.id }).url);
                    }}
                />
            </div>
        </>
    );
}
