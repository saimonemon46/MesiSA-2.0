<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Doctor extends Model
{
    use HasFactory;

    protected $fillable = [
        'hospital_id',
        'department_id',
        'name',
        'slug',
        'title',
        'sub_specialty',
        'qualifications',
        'experience_years',
        'consultation_fee',
        'availability',
        'rating',
        'review_count',
        'bio',
        'is_accepting_new_patients',
    ];

    protected $casts = [
        'consultation_fee' => 'float',
        'rating' => 'float',
        'experience_years' => 'integer',
        'review_count' => 'integer',
        'is_accepting_new_patients' => 'boolean',
    ];

    public function hospital(): BelongsTo
    {
        return $this->belongsTo(Hospital::class);
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }
}
