<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TriageMessage extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'triage_session_id',
        'sender_role',
        'message',
        'red_flag_score',
        'structured_data',
        'created_at',
    ];

    protected function casts(): array
    {
        return [
            'red_flag_score' => 'float',
            'structured_data' => 'array',
            'created_at' => 'datetime',
        ];
    }

    public function triageSession(): BelongsTo
    {
        return $this->belongsTo(TriageSession::class);
    }
}
