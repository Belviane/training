<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class Apprenant extends Model
{
     use HasFactory;

    protected $fillable = [
        'matricule',
        'utilisateur_id'
    ];



     public function utilisateur() {
        return $this->belongsTo(User::class, 'utilisateur_id');
    }
    public static function genererMatricule($prenom, $nom)
    {
        $debutPrenom = strtoupper(substr($prenom, 0, 2));
        $debutNom = strtoupper(substr($nom, 0, 2));
        $date = now()->format('d');

        return $debutPrenom . $debutNom . $date;
    }


   public function formations() {
        return $this->belongsToMany(Formation::class, 'formation_apprenant')
               ->withPivot(['formateur_id', 'date_inscription', 'statut'])
               ->withTimestamps();
    }
}

