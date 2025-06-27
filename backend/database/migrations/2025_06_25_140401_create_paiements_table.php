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
        Schema::create('paiements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('apprenant_id')->constrained()->onDelete('cascade');
            $table->foreignId('formation_id')->constrained()->onDelete('cascade');
            $table->decimal('montant', 10, 2);
            $table->enum('methode', ['OM', 'MOMO', 'carte_bancaire', 'espèce']);
            // Type de paiement : frais principaux ou spécifiques
            $table->enum('type_paiement', [
                'frais_formation',
                'frais_inscription',
                'frais_certification',
                'autres'
            ]);
            $table->string('reference')->nullable();
            $table->string('motif')->nullable();
            $table->enum('statut', ['en_attente', 'effectue', 'echoue'])->default('en_attente');
            $table->dateTime('date_paiement')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('paiements');
    }
};
