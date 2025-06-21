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
        Schema::table('utilisateurs', function (Blueprint $table) {

            $table->boolean('doit_changer_mot_de_passe')->default(true)->after('email_verified');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {

        Schema::table('utilisateurs', function (Blueprint $table) {
            $table->dropColumn([ 'doit_changer_mot_de_passe']);
        });

    }
};
