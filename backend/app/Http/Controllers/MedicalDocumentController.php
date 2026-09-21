<?php

namespace App\Http\Controllers;

use App\Models\MedicalDocument;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MedicalDocumentController extends Controller
{
    /**
     * Display a listing of medical knowledge documents.
     * Supports filtering by kb_source for Federated RAG.
     */
    public function index(Request $request): JsonResponse
    {
        $query = MedicalDocument::query()->with(['hospital', 'department']);

        // Filter by Knowledge Base partition for Federated RAG
        if ($request->filled('kb_source')) {
            $query->where('kb_source', $request->query('kb_source'));
        }

        // Filter by Department code or slug
        if ($request->filled('department')) {
            $dept = $request->query('department');
            $query->whereHas('department', function ($q) use ($dept) {
                $q->where('slug', $dept)->orWhere('code', strtoupper($dept));
            });
        }

        if ($request->filled('condition')) {
            $query->where('condition_name', 'ilike', '%' . $request->query('condition') . '%');
        }

        $documents = $query->get();

        return response()->json([
            'success' => true,
            'count' => $documents->count(),
            'kb_source' => $request->query('kb_source', 'all'),
            'data' => $documents,
        ]);
    }

    /**
     * Display a specific medical document with citation and full content.
     */
    public function show(string $identifier): JsonResponse
    {
        $doc = MedicalDocument::where('document_code', $identifier)
            ->orWhere('id', is_numeric($identifier) ? $identifier : 0)
            ->with(['hospital', 'department'])
            ->firstOrFail();

        return response()->json([
            'success' => true,
            'data' => $doc,
        ]);
    }
}
