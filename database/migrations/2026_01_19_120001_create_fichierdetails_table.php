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
        Schema::create('fichierdetails', function (Blueprint $table) {
            $table->id();
            $table->foreignId('fichie_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('nom_fichier');
            $table->string('nom_stockage')->unique();
            $table->string('chemin_complet', 500);
            $table->bigInteger('taille_octets');
            $table->string('type_mime', 100);
            $table->string('extension', 10);
            $table->foreignId('uploadeur_id')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('statut_id')->default(1)->constrained()->cascadeOnDelete();
            $table->text('description')->nullable();
            $table->boolean('storage_public')->default(true);
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fichierdetails');
    }
};
