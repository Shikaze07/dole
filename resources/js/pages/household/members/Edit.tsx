import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, FilePen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { show } from '@/routes/household';
import { update } from '@/routes/household/members';
import { MemberForm } from './_MemberForm';

type CivilStatus = 'single' | 'married' | 'widowed' | 'divorced' | 'separated';
type Gender = 'male' | 'female' | 'other';

type Household = {
    id: number;
    fathers_name: string;
    mothers_name: string;
};

type Member = {
    id: number;
    child_name: string;
    birth_date: string;
    age: number;
    gender: Gender;
    civil_status: CivilStatus;
};

export default function Edit({
    household,
    member,
}: {
    household: Household;
    member: Member;
}) {
    return (
        <>
            <Head title={`Edit Member — Household #${household.id}`} />

            <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 p-6">
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
                        <div className="flex size-10 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30">
                            <FilePen className="size-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">
                                Edit Member
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Household: {household.fathers_name} &amp;{' '}
                                {household.mothers_name}
                            </p>
                        </div>
                    </div>
                </div>

                <MemberForm
                    submitLabel="Update Member"
                    initialData={{
                        child_name: member.child_name,
                        birth_date: member.birth_date,
                        age: String(member.age),
                        gender: member.gender,
                        civil_status: member.civil_status,
                    }}
                    onSubmit={(form) => {
                        form.patch(
                            update({
                                household: household.id,
                                member: member.id,
                            }).url,
                        );
                    }}
                />
            </div>
        </>
    );
}
