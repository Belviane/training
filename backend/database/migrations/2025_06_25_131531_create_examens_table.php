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
        Schema::create('examens', function (Blueprint $table) {
            $table->id();

            $table->string('titre');
            $table->string('type_examen'); // test ou evaluation
            $table->date('date');
            $table->time('heure_debut');
            $table->time('heure_fin');
            $table->string('statut')->default('planifié');
            $table->string('description')->nullable();

            $table->unsignedBigInteger('module_id');
            $table->unsignedBigInteger('formateur_id')->nullable();
            $table->unsignedBigInteger('classe_id')->nullable();
            $table->timestamps();

            $table->foreign('module_id')->references('id')->on('modules')->onDelete('cascade');
            $table->foreign('formateur_id')->references('id')->on('formateurs')->onDelete('set null');
            $table->foreign('classe_id')->references('id')->on('classes')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('examens');
    }
};
