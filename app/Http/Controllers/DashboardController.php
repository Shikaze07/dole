<?php

namespace App\Http\Controllers;

use App\Models\Household;
use App\Models\Members;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __invoke()
    {
        $totalHouseholds = Household::count();
        $totalMembers = Members::count();
        $avgIncome = Household::avg('family_income') ?? 0;

        // House status distribution
        $houseStatusStats = Household::select('house_status', \DB::raw('count(*) as count'))
            ->groupBy('house_status')
            ->get()
            ->pluck('count', 'house_status')
            ->toArray();

        // Gender distribution
        $genderStats = Members::select('gender', \DB::raw('count(*) as count'))
            ->groupBy('gender')
            ->get()
            ->pluck('count', 'gender')
            ->toArray();

        // Latest households
        $latestHouseholds = Household::withCount('members')
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('dashboard', [
            'stats' => [
                'total_households'   => $totalHouseholds,
                'total_members'      => $totalMembers,
                'average_income'     => round($avgIncome, 2),
                'house_status_stats' => [
                    'rent'                         => $houseStatusStats['rent'] ?? 0,
                    'owned'                        => $houseStatusStats['owned'] ?? 0,
                    'living_together_with_parents' => $houseStatusStats['living_together_with_parents'] ?? 0,
                    'others'                       => $houseStatusStats['others'] ?? 0,
                    'separated'                    => $houseStatusStats['separated'] ?? 0,
                ],
                'gender_stats' => [
                    'male'   => $genderStats['male'] ?? 0,
                    'female' => $genderStats['female'] ?? 0,
                    'other'  => $genderStats['other'] ?? 0,
                ],
            ],
            'latest_households' => $latestHouseholds,
        ]);
    }
}
