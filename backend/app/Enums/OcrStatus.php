<?php

namespace App\Enums;

enum OcrStatus: string
{
    case PENDING = 'pending';
    case PROCESSING = 'processing';
    case COMPLETED = 'completed';
    case LOW_CONFIDENCE = 'low_confidence';
    case FAILED = 'failed';
}
