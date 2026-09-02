<?php

namespace App\Models;

use App\Enums\RiskLevel;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class TriageSession extends Model
{
    protected $fillable = [
        'patient_id',
        'session_token',
        'thread_id',
        'status',
        'risk_level',
        'red_flag_detected',
        'red_flag_details',
        'contradiction_detected',
        'ai_summary',
        'recommended_action',
        'metadata',
        'completed_at',
    ];

    protected function casts(): array
    {
        return [
            'risk_level' => RiskLevel::class,
            'red_flag_detected' => 'boolean',
            'contradiction_detected' => 'boolean',
            'red_flag_details' => 'array',
            'metadata' => 'array',
            'completed_at' => 'datetime',
        ];
    }

    public function patient(): BelongsTo
    {
        return $this->belongsTo(User::class, 'patient_id');
    }

    public function messages(): HasMany
    {
        return $this->hasMany(TriageMessage::class);
    }

    public function clinicalReport(): HasOne
    {
        return $this->hasOne(ClinicalReport::class);
    }
}
