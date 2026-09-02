<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SystemSetting extends Model
{
    protected $fillable = [
        'key',
        'value',
        'group',
        'is_secret',
        'description',
    ];

    protected function casts(): array
    {
        return [
            'is_secret' => 'boolean',
        ];
    }
}
