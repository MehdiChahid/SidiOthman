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
        Schema::table('appartements', function (Blueprint $table) {
            // Ajoute la relation avec user
            $table->foreignId('user_id')
                  ->nullable() // si appartement peut être sans utilisateur
                  ->constrained() // référence la table users
                  ->nullOnDelete(); // si utilisateur supprimé, on met à null
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('appartements', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn('user_id');
        });
    }
};
