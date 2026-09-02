<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Medication extends Model
{
    protected $fillable = [
        'patient_id',
        'document_id',
        'name',
        'generic_name',
        'dosage',
        'frequency',
        'route',
        'start_date',
        'end_date',
        'status',
        'prescribed_by',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
        ];
    }

    public function patient(): BelongsTo
    {
        return $this->belongsTo(User::class, 'patient_id');
    }

    public function document(): BelongsTo
    {
        return $this->belongsTo(MedicalDocument::class, 'document_id');
    }
}
