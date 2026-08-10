<?php

namespace App\Http\Controllers;

use App\Models\Household;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HouseholdController extends Controller
{
    /**
     * Display a listing of households.
     */
    public function index(Request $request)
    {
        $perPage = $request->integer('per_page', 10);
        if (!in_array($perPage, [10, 20, 50, 100])) {
            $perPage = 10;
        }

        return Inertia::render('household/index', [
            'households' => Household::withCount('members')
                ->latest()
                ->paginate($perPage)
                ->withQueryString(),
        ]);
    }

    /**
     * Show the form for creating a new household.
     */
    public function create()
    {
        return Inertia::render('household/create');
    }

    /**
     * Store a newly created household in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'fathers_name'       => 'required|string|max:255',
            'mothers_name'       => 'required|string|max:255',
            'fathers_occupation' => 'required|string|max:255',
            'mothers_occupation' => 'required|string|max:255',
            'home_address'       => 'required|string|max:500',
            'family_income'      => 'required|numeric|min:0',
            'house_status'       => 'required|in:rent,owned,living_together_with_parents,others,separated',
            'members'            => 'nullable|array',
            'members.*.birth_date'   => 'required_with:members.*|date|before_or_equal:today',
            'members.*.age'          => 'required_with:members.*|integer|min:0|max:150',
            'members.*.gender'       => 'required_with:members.*|in:male,female,other',
            'members.*.civil_status' => 'required_with:members.*|in:single,married,widowed,divorced,separated',
        ]);

        try {
            $household = \DB::transaction(function () use ($validated) {
                $household = Household::create(\Arr::except($validated, ['members']));

                if (!empty($validated['members'])) {
                    $household->members()->createMany($validated['members']);
                }

                return $household;
            });

            Inertia::flash('toast', [
                'type' => 'success',
                'message' => 'Household created successfully.',
            ]);

            return redirect()->route('household.show', $household);
        } catch (\Exception $e) {
            \Log::error($e->getMessage());

            Inertia::flash('toast', [
                'type' => 'error',
                'message' => 'Failed to create household record. Please try again.',
            ]);

            return back()->withInput();
        }
    }


    /**
     * Display the specified household.
     */
    public function show(Household $household)
    {
        $household->load('members');

        return Inertia::render('household/show', [
            'household' => $household,
        ]);
    }

    /**
     * Show the form for editing the specified household.
     */
    public function edit(Household $household)
    {
        $household->load('members');

        return Inertia::render('household/Edit', [
            'household' => $household,
        ]);
    }

    /**
     * Update the specified household in storage.
     */
    public function update(Request $request, Household $household)
    {
        $validated = $request->validate([
            'fathers_name'       => 'required|string|max:255',
            'mothers_name'       => 'required|string|max:255',
            'fathers_occupation' => 'required|string|max:255',
            'mothers_occupation' => 'required|string|max:255',
            'home_address'       => 'required|string|max:500',
            'family_income'      => 'required|numeric|min:0',
            'house_status'       => 'required|in:rent,owned,living_together_with_parents,others,separated',
            'members'            => 'nullable|array',
            'members.*.id'           => 'nullable|integer|exists:members,id',
            'members.*.birth_date'   => 'required_with:members.*|date|before_or_equal:today',
            'members.*.age'          => 'required_with:members.*|integer|min:0|max:150',
            'members.*.gender'       => 'required_with:members.*|in:male,female,other',
            'members.*.civil_status' => 'required_with:members.*|in:single,married,widowed,divorced,separated',
        ]);

        try {
            \DB::transaction(function () use ($validated, $household) {
                $household->update(\Arr::except($validated, ['members']));

                $membersPayload = $validated['members'] ?? [];
                $payloadIds = collect($membersPayload)->pluck('id')->filter()->toArray();

                // 1. Delete members that are not in the payload
                $household->members()->whereNotIn('id', $payloadIds)->delete();

                // 2. Create or update payload members
                foreach ($membersPayload as $memberData) {
                    if (!empty($memberData['id'])) {
                        $household->members()->where('id', $memberData['id'])->update([
                            'birth_date' => $memberData['birth_date'],
                            'age' => $memberData['age'],
                            'gender' => $memberData['gender'],
                            'civil_status' => $memberData['civil_status'],
                        ]);
                    } else {
                        $household->members()->create($memberData);
                    }
                }
            });

            Inertia::flash('toast', [
                'type' => 'success',
                'message' => 'Household updated successfully.',
            ]);

            return redirect()->route('household.show', $household);
        } catch (\Exception $e) {
            \Log::error($e->getMessage());

            Inertia::flash('toast', [
                'type' => 'error',
                'message' => 'Failed to update household record. Please try again.',
            ]);

            return back()->withInput();
        }
    }

    /**
     * Remove the specified household from storage.
     */
    public function destroy(Household $household)
    {
        try {
            $household->delete();

            Inertia::flash('toast', [
                'type' => 'success',
                'message' => 'Household deleted successfully.',
            ]);

            return redirect()->route('household.index');
        } catch (\Exception $e) {
            \Log::error($e->getMessage());

            Inertia::flash('toast', [
                'type' => 'error',
                'message' => 'Failed to delete household. Please check if it has dependencies and try again.',
            ]);

            return back();
        }
    }
}
