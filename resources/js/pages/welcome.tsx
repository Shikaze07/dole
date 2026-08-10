import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard, login, register } from '@/routes';

const DOLE_SEAL =
    'https://commons.wikimedia.org/wiki/Special:FilePath/Department_of_Labor_and_Employment_(DOLE).svg';
const PH_FLAG =
    'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_the_Philippines.svg';
const HOUSEHOLD_PHOTO =
    'https://oton.gov.ph/wp-content/uploads/2024/07/tupadprogpic1.jpg';

export default function Welcome() {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="TUPAD Household Management System">
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,500;6..72,600;6..72,700&family=Public+Sans:wght@400;500;600;700&display=swap"
                    rel="stylesheet"
                />
            </Head>

            <div className="flex min-h-screen flex-col bg-[#F6F7FB] font-['Public_Sans'] text-[#1b1b18] dark:bg-[#05070F] dark:text-[#EDEDEC]">
                {/* Official government banner */}
                <div className="flex items-center justify-center gap-2 bg-[#002569] px-4 py-1.5 text-center text-[11px] text-white/90">
                    <img src={PH_FLAG} alt="" className="h-3 w-4.5 shrink-0 rounded-[1px]" />
                    <span>
                        An unofficial system of the Republic of the Philippines &middot; Department of Labor and Employment
                    </span>
                </div>

                {/* Header */}
                <header className="mx-auto w-full max-w-6xl px-6 py-5">
                    <nav className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <img src={DOLE_SEAL} alt="DOLE seal" className="h-11 w-11 shrink-0" />
                            <div className="leading-tight">
                                <p className="text-[11px] font-semibold tracking-wide text-[#0038A8] uppercase dark:text-[#7C93E0]">
                                    Department of Labor and Employment
                                </p>
                                <p className="font-['Newsreader'] text-lg font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">
                                    TUPAD Sambahayan
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 text-sm">
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="inline-block rounded-sm border border-[#0038A8] bg-[#0038A8] px-5 py-1.5 leading-normal text-white hover:bg-[#002569]"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="inline-block rounded-sm border border-transparent px-4 py-1.5 leading-normal text-[#1b1b18] hover:border-[#0038A8]/30 dark:text-[#EDEDEC] dark:hover:border-[#7C93E0]/40"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={register()}
                                        className="inline-block rounded-sm border border-[#0038A8] bg-[#0038A8] px-5 py-1.5 leading-normal text-white hover:bg-[#002569]"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                </header>

                {/* Tricolor accent rule */}
                <div className="flex h-1 w-full">
                    <div className="flex-1 bg-[#0038A8]" />
                    <div className="flex-1 bg-[#FCD116]" />
                    <div className="flex-1 bg-[#CE1126]" />
                </div>

                {/* Hero */}
                <main className="mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 items-center gap-10 px-6 py-12 lg:grid-cols-[1.1fr_1fr] lg:py-16">
                    <div>
                        <p className="mb-3 text-xs font-semibold tracking-widest text-[#CE1126] uppercase">
                            Household Beneficiary Records
                        </p>
                        <h1 className="font-['Newsreader'] text-4xl leading-[1.1] font-semibold text-[#1b1b18] sm:text-5xl dark:text-white">
                            Manage every TUPAD household, from listing to payout.
                        </h1>
                        <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-[#5b5a54] dark:text-[#B8B7B0]">
                            A shared workspace for DOLE field officers and barangay coordinators to keep the
                            household masterlist current, verify eligibility, and track wages for workers engaged
                            in community-based emergency employment projects.
                        </p>

                        <ul className="mt-6 flex flex-col gap-1 text-[13px] leading-[20px]">
                            <li className="relative flex items-center gap-4 py-2 before:absolute before:top-1/2 before:bottom-0 before:left-[0.4rem] before:border-l before:border-[#0038A8]/20">
                                <span className="relative bg-[#F6F7FB] py-1 dark:bg-[#05070F]">
                                    <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-[#0038A8]/30 bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.06)] dark:bg-[#0d1220]">
                                        <span className="h-1.5 w-1.5 rounded-full bg-[#0038A8]" />
                                    </span>
                                </span>
                                <span>
                                    See how households are verified with the barangay and LGU before
                                    <a
                                        href="https://dole.gov.ph/tupad-contents/"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="ml-1 inline-flex items-center font-medium text-[#0038A8] underline underline-offset-4 dark:text-[#7C93E0]"
                                    >
                                        enrollment
                                    </a>
                                </span>
                            </li>
                            <li className="relative flex items-center gap-4 py-2 before:absolute before:top-0 before:bottom-1/2 before:left-[0.4rem] before:border-l before:border-[#0038A8]/20">
                                <span className="relative bg-[#F6F7FB] py-1 dark:bg-[#05070F]">
                                    <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-[#0038A8]/30 bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.06)] dark:bg-[#0d1220]">
                                        <span className="h-1.5 w-1.5 rounded-full bg-[#0038A8]" />
                                    </span>
                                </span>
                                <span>
                                    Read the official program guidelines on the
                                    <a
                                        href="https://dole.gov.ph/"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="ml-1 inline-flex items-center font-medium text-[#0038A8] underline underline-offset-4 dark:text-[#7C93E0]"
                                    >
                                        DOLE website
                                    </a>
                                </span>
                            </li>
                        </ul>

                        <div className="mt-7 grid grid-cols-3 gap-3 text-center">
                            <div className="rounded-md border border-[#0038A8]/15 bg-white px-2 py-3 dark:border-white/10 dark:bg-[#0d1220]">
                                <p className="font-['Newsreader'] text-xl font-semibold text-[#0038A8] dark:text-[#7C93E0]">
                                    10&ndash;30
                                </p>
                                <p className="text-[11px] text-[#6b6a63] dark:text-[#9a998f]">days of paid work</p>
                            </div>
                            <div className="rounded-md border border-[#0038A8]/15 bg-white px-2 py-3 dark:border-white/10 dark:bg-[#0d1220]">
                                <p className="font-['Newsreader'] text-xl font-semibold text-[#0038A8] dark:text-[#7C93E0]">
                                    Minimum wage
                                </p>
                                <p className="text-[11px] text-[#6b6a63] dark:text-[#9a998f]">regional daily rate</p>
                            </div>
                            <div className="rounded-md border border-[#0038A8]/15 bg-white px-2 py-3 dark:border-white/10 dark:bg-[#0d1220]">
                                <p className="font-['Newsreader'] text-xl font-semibold text-[#0038A8] dark:text-[#7C93E0]">
                                    Barangay-verified
                                </p>
                                <p className="text-[11px] text-[#6b6a63] dark:text-[#9a998f]">household masterlist</p>
                            </div>
                        </div>

                        <div className="mt-8 flex flex-wrap gap-3">
                            {/* <Link
                                href={auth.user ? dashboard() : login()}
                                className="inline-block rounded-sm border border-[#0038A8] bg-[#0038A8] px-6 py-2 text-sm leading-normal text-white hover:bg-[#002569]"
                            >
                                Access the system
                            </Link>
                            {!auth.user && (
                                <Link
                                    href={register()}
                                    className="inline-block rounded-sm border border-[#1b1b18]/15 px-6 py-2 text-sm leading-normal text-[#1b1b18] hover:border-[#0038A8]/40 dark:border-white/15 dark:text-white"
                                >
                                    Register an encoder account
                                </Link>
                            )} */}
                        </div>
                    </div>

                    {/* Photo panel */}
                    <div className="relative overflow-hidden rounded-lg border border-[#0038A8]/15 bg-white dark:border-white/10 dark:bg-[#0d1220]">
                        <div className="relative aspect-[4/3] w-full overflow-hidden">
                            <img
                                src={HOUSEHOLD_PHOTO}
                                alt="A Filipino household"
                                className="h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#002569]/70 via-transparent to-transparent" />
                            <span className="absolute right-2 bottom-1.5 text-[9px] text-white/70">
                                Photo: Markytour777 &middot; Wikimedia Commons &middot; CC BY-SA 4.0
                            </span>
                        </div>

                        <div className="flex items-center gap-3 border-t border-[#0038A8]/10 bg-white/70 px-5 py-4 backdrop-blur-sm dark:border-white/10 dark:bg-black/30">
                            <img src={DOLE_SEAL} alt="" className="h-8 w-8 shrink-0 opacity-90" />
                            <p className="text-[12px] leading-snug text-[#4b4a45] dark:text-[#B8B7B0]">
                                Built for household coordination across barangays and DOLE field offices
                                nationwide.
                            </p>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="mx-auto w-full max-w-6xl px-6 py-6 text-center text-[11px] text-[#8a8980] dark:text-[#6b6a63]">
                    Household data is handled in accordance with the Data Privacy Act of 2012. Learn more at{' '}
                    <a
                        href="https://dole.gov.ph/"
                        target="_blank"
                        rel="noreferrer"
                        className="underline underline-offset-2"
                    >
                        dole.gov.ph
                    </a>
                    .
                </footer>
            </div>
        </>
    );
}