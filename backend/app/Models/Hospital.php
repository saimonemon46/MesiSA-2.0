<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Hospital extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'address',
        'city',
        'state',
        'postal_code',
        'phone',
        'email',
        'emergency_services',
        'emergency_hotline',
        'status',
        'meta',
    ];

    protected function casts(): array
    {
        return [
            'emergency_services' => 'boolean',
            'meta' => 'array',
        ];
    }

    public function doctorProfiles(): HasMany
    {
        return $this->hasMany(DoctorProfile::class);
    }

    public function appointments(): HasMany
    {
        return $this->hasMany(Appointment::class);
    }
}
