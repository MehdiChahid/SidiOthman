<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reserves', function (Blueprint $table) {
            $table->id();
            $table->foreignId('appartement_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('immeuble_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('secteur_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('projet_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('agent_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->foreignId('categor_id')->default(1)->constrained()->cascadeOnDelete();
            $table->enum('priority', ['basse', 'moyenne', 'haute'])->default('moyenne');
            $table->foreignId('fichie_id')->constrained()->cascadeOnDelete();
            $table->date('reported_at')->nullable();
            $table->date('closed_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reserves');
    }
};
