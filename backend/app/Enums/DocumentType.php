<?php

namespace App\Enums;

enum DocumentType: string
{
    case PRESCRIPTION = 'prescription';
    case LAB_REPORT = 'lab_report';
    case DISCHARGE_SUMMARY = 'discharge_summary';
    case RADIOLOGY = 'radiology';
    case OTHER = 'other';
}
