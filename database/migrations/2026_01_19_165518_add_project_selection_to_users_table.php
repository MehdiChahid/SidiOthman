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
        Schema::table('users', function (Blueprint $table) {

            $table->foreignId('projet_id')->nullable()->constrained('projets')->nullOnDelete();
            $table->foreignId('secteur_id')->nullable()->constrained('secteurs')->nullOnDelete();
            $table->foreignId('immeuble_id')->nullable()->constrained('immeubles')->nullOnDelete();
            $table->foreignId('appartement_id')->nullable()->constrained('appartements')->nullOnDelete();
            $table->boolean('registration_completed')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['projet_id']);
            $table->dropForeign(['secteur_id']);
            $table->dropForeign(['immeuble_id']);
            $table->dropForeign(['appartement_id']);
            $table->dropColumn(['projet_id', 'secteur_id', 'immeuble_id', 'appartement_id', 'registration_completed']);
       
        });
    }
};
