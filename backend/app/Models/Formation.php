<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;

use Illuminate\Database\Eloquent\Model;

class Formation extends Model
{
   use HasFactory;

    protected $fillable = [
        'nom_formation',
        'libelle_formation',
        'date_debutf',
        'date_finf',
        'nombre_seancef',
    ];



    public function inscriptions()
    {
        return $this->hasMany(Inscription::class);
    }

    public function apprenants() {
        return $this->belongsToMany(Apprenant::class, 'formation_apprenant')
               ->withPivot(['formateur_id', 'date_inscription', 'statut'])
               ->withTimestamps();
    }

}
