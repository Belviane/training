<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Superviseur extends Model
{
    use HasFactory;

    protected $fillable = [
        'matriculeSU',
        'utilisateur_id',
        'date_derniere_action'
    ];
    protected $table = 'superviseurs';

    protected static function booted()
    {
        static::creating(function ($superviseur) {
            $user = $superviseur->utilisateur;

            $date = Carbon::parse($user->date_naissance);
            $annee = $date->format('Y'); // 1995
            $jour = $date->format('d');  // 13
            $mois = $date->format('m');  // 04

            $nom = ucfirst(strtolower($user->nom));
            $prenom = ucfirst(strtolower($user->prenom));

            $superviseur->matricule = 'SU' .
                substr($annee, -2) .
                substr($nom, 0, 2) .
                $jour .
                substr($prenom, -2) .
                $mois;
        });
    }




    public function utilisateur()
    {
        return $this->belongsTo(User::class, 'utilisateur_id');
    }
}
