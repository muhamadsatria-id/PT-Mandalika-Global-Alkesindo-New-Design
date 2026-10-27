<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('service_requests', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->foreignId('customer_id')->constrained()->restrictOnDelete();
            $table->string('equipment_name');
            $table->string('brand')->nullable();
            $table->string('model')->nullable();
            $table->string('serial_number')->nullable();
            $table->text('issue');
            $table->string('location')->nullable();
            $table->enum('preference', ['teknisi_datang', 'kirim_alat', 'antar_sendiri'])->default('teknisi_datang');
            $table->enum('status', [
                'Diterima',
                'Dijadwalkan',
                'Diagnosa',
                'Menunggu Persetujuan',
                'Dikerjakan',
                'Pengujian',
                'Selesai',
                'Diambil',
                'Dikirim',
                'Batal',
            ])->default('Diterima');
            $table->foreignId('technician_id')->nullable()->constrained('users')->nullOnDelete();
            $table->unsignedBigInteger('estimated_cost')->nullable();
            $table->timestamp('scheduled_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['status', 'created_at']);
            $table->index('technician_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('service_requests');
    }
};
