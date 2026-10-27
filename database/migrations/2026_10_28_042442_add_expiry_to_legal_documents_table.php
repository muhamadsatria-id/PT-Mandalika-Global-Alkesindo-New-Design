<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('legal_documents', function (Blueprint $table) {
            $table->date('expires_at')->nullable()->after('issued_at');
            $table->string('group')->nullable()->index()->after('type');
            $table->text('notes')->nullable()->after('description');
        });
    }

    public function down(): void
    {
        Schema::table('legal_documents', function (Blueprint $table) {
            $table->dropColumn(['expires_at', 'group', 'notes']);
        });
    }
};
