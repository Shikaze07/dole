<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HouseholdController;
use App\Http\Controllers\MembersController;
use App\Http\Controllers\TestController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');

    Route::resource('household', HouseholdController::class);

    // Nested member routes scoped under household
    Route::get('household/{household}/members/create', [MembersController::class, 'create'])
        ->name('household.members.create');
    Route::post('household/{household}/members', [MembersController::class, 'store'])
        ->name('household.members.store');
    Route::get('household/{household}/members/{member}/edit', [MembersController::class, 'edit'])
        ->name('household.members.edit');
    Route::patch('household/{household}/members/{member}', [MembersController::class, 'update'])
        ->name('household.members.update');
    Route::delete('household/{household}/members/{member}', [MembersController::class, 'destroy'])
        ->name('household.members.destroy');

    Route::resource('tests', TestController::class);
});

require __DIR__.'/settings.php';

