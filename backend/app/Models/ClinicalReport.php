<?php

namespace App\Models;

use App\Enums\RiskLevel;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ClinicalReport extends Model
{
    protected $fillable = [
        'triage_session_id',
        'patient_id',
        'doctor_id',
        'report_number',
        'summary',
        'clinical_assessment',
        'recommendations',
        'vitals_snapshot',
        'risk_level',
        'is_overridden',
        'override_reason',
        'override_by_doctor_id',
        'override_at',
        'finalized_at',
    ];

    protected function casts(): array
    {
        return [
            'risk_level' => RiskLevel::class,
            'is_overridden' => 'boolean',
            'vitals_snapshot' => 'array',
            'override_at' => 'datetime',
            'finalized_at' => 'datetime',
        ];
    }

    public function triageSession(): BelongsTo
    {
        return $this->belongsTo(TriageSession::class);
    }

    public function patient(): BelongsTo
    {
        return $this->belongsTo(User::class, 'patient_id');
    }

    public function doctor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'doctor_id');
    }

    public function overrideByDoctor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'override_by_doctor_id');
    }
}
