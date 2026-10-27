<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('brands', function (Blueprint $table) {
            $table->enum('status', ['principal_resmi', 'tersedia'])->default('tersedia')->after('is_active');
            $table->text('short_description')->nullable()->after('description');
            $table->string('website_url')->nullable()->after('short_description');
            $table->string('surat_penunjukan_path')->nullable()->after('website_url');
        });
    }

    public function down(): void
    {
        Schema::table('brands', function (Blueprint $table) {
            $table->dropColumn(['status', 'short_description', 'website_url', 'surat_penunjukan_path']);
        });
    }
};
