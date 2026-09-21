<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MedicalDocument extends Model
{
    use HasFactory;

    protected $fillable = [
        'hospital_id',
        'department_id',
        'kb_source',
        'document_code',
        'title',
        'condition_name',
        'clinical_summary',
        'full_content',
        'evidence_level',
        'citation',
        'keywords',
    ];

    protected $casts = [
        'keywords' => 'array',
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
