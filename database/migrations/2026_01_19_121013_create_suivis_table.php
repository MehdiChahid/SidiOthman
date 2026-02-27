<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * suivi de reservation
     */
    public function up(): void
    {
        Schema::create('suivis', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->foreignId('statut_id')->constrained()->cascadeOnDelete();
            $table->text('description')->nullable();
            $table->foreignId('fichie_id')->constrained()->cascadeOnDelete();
            $table->foreignId('reserve_id')->constrained()->cascadeOnDelete();
            $table->foreignId('agent_id')->nullable()->constrained("users")->cascadeOnDelete();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('suivis');
    }
};
