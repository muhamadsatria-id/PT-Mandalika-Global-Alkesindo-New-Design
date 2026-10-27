<?php

namespace App\Models\Concerns;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

/**
 * @phpstan-require-extends Model
 *
 * @property string $slug
 * @property string $name
 */
trait HasSlug
{
    protected static function bootHasSlug(): void
    {
        static::saving(function (self $model): void {
            if (filled($model->slug)) {
                return;
            }

            $source = (string) $model->{$model->slugSource()};
            $base = Str::slug($source);

            if ($base === '') {
                $base = Str::lower(Str::random(8));
            }

            $model->slug = $model->uniqueSlug($base);
        });
    }

    protected function slugSource(): string
    {
        return 'name';
    }

    protected function uniqueSlug(string $base): string
    {
        $slug = $base;
        $suffix = 2;

        while (static::withTrashed()->where('slug', $slug)->exists()) {
            $slug = $base.'-'.$suffix;
            $suffix++;
        }

        return $slug;
    }
}
