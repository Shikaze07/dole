<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Members extends Model
{
    protected $fillable = [
        'household_id',
        'birth_date',
        'age',
        'gender',
        'civil_status',
    ];

    protected $casts = [
        'birth_date' => 'date:Y-m-d',
        'age'        => 'integer',
    ];

    public function household(): BelongsTo
    {
        return $this->belongsTo(Household::class);
    }
}

