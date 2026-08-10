<?php

namespace App\Http\Controllers;

use App\Models\Household;
use App\Models\Members;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MembersController extends Controller
{
    /**
     * Show the form to add a new member to a household.
     */
    public function create(Household $household)
    {
        return Inertia::render('household/members/create', [
            'household' => $household,
        ]);
    }

    /**
     * Store a new member under the given household.
     */
    public function store(Request $request, Household $household)
    {
        $validated = $request->validate([
            'child_name'   => 'required|string|max:255',
            'birth_date'   => 'required|date|before_or_equal:today',
            'age'          => 'required|integer|min:0|max:150',
            'gender'       => 'required|in:male,female,other',
            'civil_status' => 'required|in:single,married,widowed,divorced,separated',
        ]);

        try {
            $household->members()->create($validated);

            Inertia::flash('toast', [
                'type' => 'success',
                'message' => 'Member added successfully.',
            ]);

            return redirect()->route('household.show', $household);
        } catch (\Exception $e) {
            \Log::error($e->getMessage());

            Inertia::flash('toast', [
                'type' => 'error',
                'message' => 'Failed to add member to household. Please try again.',
            ]);

            return back()->withInput();
        }
    }

    /**
     * Show the edit form for a member.
     */
    public function edit(Household $household, Members $member)
    {
        return Inertia::render('household/members/Edit', [
            'household' => $household,
            'member'    => $member,
        ]);
    }

    /**
     * Update the specified member.
     */
    public function update(Request $request, Household $household, Members $member)
    {
        $validated = $request->validate([
            'child_name'   => 'required|string|max:255',
            'birth_date'   => 'required|date|before_or_equal:today',
            'age'          => 'required|integer|min:0|max:150',
            'gender'       => 'required|in:male,female,other',
            'civil_status' => 'required|in:single,married,widowed,divorced,separated',
        ]);

        try {
            $member->update($validated);

            Inertia::flash('toast', [
                'type' => 'success',
                'message' => 'Member updated successfully.',
            ]);

            return redirect()->route('household.show', $household);
        } catch (\Exception $e) {
            \Log::error($e->getMessage());

            Inertia::flash('toast', [
                'type' => 'error',
                'message' => 'Failed to update member. Please try again.',
            ]);

            return back()->withInput();
        }
    }

    /**
     * Delete a member.
     */
    public function destroy(Household $household, Members $member)
    {
        try {
            $member->delete();

            Inertia::flash('toast', [
                'type' => 'success',
                'message' => 'Member removed successfully.',
            ]);

            return redirect()->route('household.show', $household);
        } catch (\Exception $e) {
            \Log::error($e->getMessage());

            Inertia::flash('toast', [
                'type' => 'error',
                'message' => 'Failed to remove member. Please try again.',
            ]);

            return back();
        }
    }
}
