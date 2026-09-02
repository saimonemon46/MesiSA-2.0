<?php

namespace App\Enums;

enum RiskLevel: string
{
    case EMERGENCY = 'emergency';
    case HIGH = 'high';
    case MEDIUM = 'medium';
    case LOW = 'low';
    case PENDING = 'pending';
}
