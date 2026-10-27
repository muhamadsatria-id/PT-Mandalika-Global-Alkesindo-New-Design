<?php

namespace App\Http\Controllers\PublicSite;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class PrivacyController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('public/privacy', [
            'seo' => [
                'title' => 'Kebijakan privasi',
                'description' => 'Cara PT. Mandalika Global Alkesindo mengumpulkan, memakai, dan melindungi data pengunjung.',
                'canonical' => route('privacy'),
            ],
        ]);
    }
}
