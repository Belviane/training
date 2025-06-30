<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;


class Seance extends Model
{
    use HasFactory;

    protected $table = 'seances';

    protected $fillable = [
        'titre',
        'description',
        'date',
        'heure_debut',
        'heure_fin',
        'type_seance',
        'statut',
        'classe_id',
        'formation_id',
        'formateur_id'
    ];

    //Une séance appartient à une classe
    public function classe()
    {
        return $this->belongsTo(Classe::class);
    }

    //Une séance appartient à une formation
    public function formation()
    {
        return $this->belongsTo(Formation::class);
    }

    //Une séance est dispensée par un formateur
    public function formateur()
    {
        return $this->belongsTo(Formateur::class);
    }

    public function presences()
    {
        return $this->hasMany(Presence::class);
    }

    public function apprenants()
    {
        return $this->belongsToMany(Apprenant::class, 'presence')
                    ->withPivot('est_present', 'justificatif', 'remarque')
                    ->withTimestamps();
    }
}
