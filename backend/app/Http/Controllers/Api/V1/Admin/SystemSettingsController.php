<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\SystemSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SystemSettingsController extends Controller
{
    public function index(): JsonResponse
    {
        $settings = SystemSetting::all()->map(function ($setting) {
            return [
                'id' => $setting->id,
                'key' => $setting->key,
                'value' => $setting->is_secret ? '********' : $setting->value,
                'group' => $setting->group,
                'is_secret' => $setting->is_secret,
                'description' => $setting->description,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $settings,
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'settings' => 'required|array',
            'settings.*.key' => 'required|string|exists:system_settings,key',
            'settings.*.value' => 'required|string',
        ]);

        foreach ($validated['settings'] as $item) {
            SystemSetting::where('key', $item['key'])->update(['value' => $item['value']]);
        }

        return response()->json([
            'success' => true,
            'message' => 'System settings updated.',
        ]);
    }
}
