<?php

namespace App\Enums;

enum WaEventType: string
{
    case Click = 'click';
    case Inquiry = 'inquiry';
    case Service = 'service';
}
