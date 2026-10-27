<?php

namespace App\Http\Middleware;

use App\Models\Setting;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureServiceFeatureEnabled
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $serviceEnabled = Setting::get('service_enabled', 'true');

        if (! in_array($serviceEnabled, ['true', true, 1, '1'], true)) {
            abort(404);
        }

        return $next($request);
    }
}
