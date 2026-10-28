<?php

test('beranda mengirim markup SEO yang dapat dibaca crawler tanpa JavaScript', function () {
    $response = $this->get(route('home'))->assertOk();

    $html = $response->getContent();

    expect($html)
        ->toContain('<html lang="id"')
        ->toContain('<h1')
        ->toContain('Alat medis yang siap dipakai')
        ->toContain('name="description"')
        ->toContain('rel="canonical"')
        ->toContain('name="robots" content="index,follow"')
        ->toContain('application/ld+json')
        ->toContain('href="'.route('catalog.index').'"')
        ->toContain('href="'.route('about').'"');

    expect($html)->not->toContain('<h1></h1>');
});

test('halaman non-publik ditandai noindex dan tanpa fallback konten publik', function () {
    $response = $this->get(route('login'))->assertOk();

    $response
        ->assertSee('noindex,nofollow')
        ->assertDontSee('Alat medis yang siap dipakai');
});

test('judul halaman tidak melebihi batas panjang dan tidak menduplikasi nama perusahaan', function () {
    $response = $this->get(route('about'))->assertOk();

    preg_match('/<title[^>]*>(.*?)<\/title>/s', $response->getContent(), $matches);

    $title = $matches[1] ?? '';

    expect($title)->not->toBe('')
        ->and(mb_strlen($title))->toBeLessThanOrEqual(62)
        ->and(substr_count($title, 'Mandalika'))->toBeLessThanOrEqual(1);
});
