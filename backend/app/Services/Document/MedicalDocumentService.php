<?php

namespace App\Services\Document;

use App\Enums\DocumentType;
use App\Enums\OcrStatus;
use App\Models\MedicalDocument;
use App\Models\Medication;
use App\Models\User;
use App\Services\Audit\AuditService;

class MedicalDocumentService
{
    public const OCR_CONFIDENCE_THRESHOLD = 0.85;

    public function __construct(protected AuditService $auditService)
    {
    }

    public function storeDocument(
        User $patient,
        string $title,
        DocumentType $type,
        string $filePath,
        ?int $fileSize = null,
        ?string $mimeType = null
    ): MedicalDocument {
        $document = MedicalDocument::create([
            'patient_id' => $patient->id,
            'title' => $title,
            'document_type' => $type,
            'file_path' => $filePath,
            'file_size' => $fileSize,
            'mime_type' => $mimeType,
            'ocr_status' => OcrStatus::PENDING,
        ]);

        $this->auditService->log(
            userId: $patient->id,
            action: 'document.upload',
            entityType: MedicalDocument::class,
            entityId: $document->id
        );

        return $document;
    }

    public function recordOcrResult(
        MedicalDocument $document,
        float $confidenceScore,
        array $extractedData
    ): MedicalDocument {
        $status = ($confidenceScore >= self::OCR_CONFIDENCE_THRESHOLD)
            ? OcrStatus::COMPLETED
            : OcrStatus::LOW_CONFIDENCE;

        $document->update([
            'ocr_status' => $status,
            'ocr_confidence' => $confidenceScore,
            'extracted_data' => $extractedData,
        ]);

        if ($status === OcrStatus::COMPLETED && !empty($extractedData['medications'])) {
            foreach ($extractedData['medications'] as $med) {
                Medication::create([
                    'patient_id' => $document->patient_id,
                    'document_id' => $document->id,
                    'name' => $med['name'],
                    'dosage' => $med['dosage'] ?? 'As prescribed',
                    'frequency' => $med['frequency'] ?? 'Daily',
                    'status' => 'active',
                ]);
            }
        }

        $this->auditService->log(
            userId: $document->patient_id,
            action: 'document.ocr_processed',
            entityType: MedicalDocument::class,
            entityId: $document->id,
            diffPayload: [
                'confidence' => $confidenceScore,
                'status' => $status->value,
            ]
        );

        return $document->fresh();
    }
}
