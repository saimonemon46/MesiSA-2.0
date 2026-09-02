<?php

namespace App\Http\Controllers\Api\V1\Patient;

use App\Enums\DocumentType;
use App\Http\Controllers\Controller;
use App\Models\MedicalDocument;
use App\Services\Document\MedicalDocumentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\Enum;

class DocumentController extends Controller
{
    public function __construct(protected MedicalDocumentService $documentService)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $documents = MedicalDocument::where('patient_id', $request->user()->id)
            ->latest()
            ->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $documents,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'document_type' => ['required', new Enum(DocumentType::class)],
            'file_path' => 'required|string',
            'file_size' => 'nullable|integer',
            'mime_type' => 'nullable|string',
        ]);

        $document = $this->documentService->storeDocument(
            patient: $request->user(),
            title: $validated['title'],
            type: DocumentType::from($validated['document_type']),
            filePath: $validated['file_path'],
            fileSize: $validated['file_size'] ?? null,
            mimeType: $validated['mime_type'] ?? null
        );

        return response()->json([
            'success' => true,
            'message' => 'Medical document uploaded.',
            'data' => $document,
        ], 201);
    }
}
