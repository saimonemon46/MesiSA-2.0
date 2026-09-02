<?php

namespace Database\Seeders;

use App\Models\SystemSetting;
use Illuminate\Database\Seeder;

class SystemSettingsSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            [
                'key' => 'ai_primary_model',
                'value' => 'gemini-2.0-flash',
                'group' => 'ai',
                'is_secret' => false,
                'description' => 'Primary LLM model used for triage reasoning.',
            ],
            [
                'key' => 'ai_fallback_model',
                'value' => 'gpt-4o-mini',
                'group' => 'ai',
                'is_secret' => false,
                'description' => 'Fallback model triggered on primary provider circuit breaker open.',
            ],
            [
                'key' => 'ai_circuit_breaker_error_threshold',
                'value' => '5',
                'group' => 'ai',
                'is_secret' => false,
                'description' => 'Number of consecutive provider failures before opening circuit.',
            ],
            [
                'key' => 'ocr_confidence_threshold',
                'value' => '0.85',
                'group' => 'triage',
                'is_secret' => false,
                'description' => 'Minimum confidence score required for automatic medication ingestion (Rule 15).',
            ],
            [
                'key' => 'emergency_dispatch_hotline',
                'value' => '911',
                'group' => 'security',
                'is_secret' => false,
                'description' => 'National / Local emergency dispatch phone number.',
            ],
            [
                'key' => 'system_maintenance_mode',
                'value' => 'false',
                'group' => 'general',
                'is_secret' => false,
                'description' => 'Global application maintenance mode toggle.',
            ],
        ];

        foreach ($settings as $setting) {
            SystemSetting::updateOrCreate(['key' => $setting['key']], $setting);
        }
    }
}
