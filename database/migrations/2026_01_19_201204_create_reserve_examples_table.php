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
        Schema::create('reserve_examples', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->foreignId('categor_id')->constrained('categors')->cascadeOnDelete();
            $table->enum('priority', ['basse', 'moyenne', 'haute'])->default('moyenne');
            $table->string('image_path')->nullable();  
            $table->string('photo_path')->nullable();  
            $table->boolean('is_active')->default(true);
            $table->integer('order')->default(0); // Pour ordonner l'affichage
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reserve_examples');
    }
};
