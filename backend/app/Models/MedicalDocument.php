<?php

namespace App\Models;

use App\Enums\DocumentType;
use App\Enums\OcrStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MedicalDocument extends Model
{
    protected $fillable = [
        'patient_id',
        'title',
        'document_type',
        'file_path',
        'file_size',
        'mime_type',
        'ocr_status',
        'ocr_confidence',
        'extracted_data',
        'is_verified',
        'verified_by_user_id',
        'verified_at',
    ];

    protected function casts(): array
    {
        return [
            'document_type' => DocumentType::class,
            'ocr_status' => OcrStatus::class,
            'ocr_confidence' => 'float',
            'extracted_data' => 'array',
            'is_verified' => 'boolean',
            'verified_at' => 'datetime',
        ];
    }

    public function patient(): BelongsTo
    {
        return $this->belongsTo(User::class, 'patient_id');
    }

    public function verifiedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by_user_id');
    }

    public function medications(): HasMany
    {
        return $this->hasMany(Medication::class, 'document_id');
    }
}
