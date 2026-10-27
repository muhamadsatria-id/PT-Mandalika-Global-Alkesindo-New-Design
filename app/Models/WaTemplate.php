<?php

namespace App\Models;

use Database\Factories\WaTemplateFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $key
 * @property string $title
 * @property string $body
 */
#[Fillable(['key', 'title', 'body'])]
class WaTemplate extends Model
{
    /** @use HasFactory<WaTemplateFactory> */
    use HasFactory;
}
