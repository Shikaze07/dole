<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Household extends Model
{
    protected $fillable = [
        'fathers_name',
        'mothers_name',
        'fathers_occupation',
        'mothers_occupation',
        'home_address',
        'family_income',
        'house_status',
    ];

    protected $casts = [
        'family_income' => 'decimal:2',
    ];

    public function members(): HasMany
    {
        return $this->hasMany(Members::class);
    }
}

