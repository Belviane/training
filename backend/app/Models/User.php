<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{

   use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $table = 'utilisateurs'; // ← TABLE personnalisée

    protected $fillable = [
        'nom',
        'prenom',
        'genre',
        'date_naissance',
        'email',
        'password',
        'role_id',
        'login',
        //'mdp',
        'is_active'
    ];

     public function getAuthPassword()
    {
        return $this->mdp;
    }

    protected $hidden = [
        'password',
        //'mdp',
        'remember_token',
    ];


    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

   public function formateur()
    {
        return $this->hasOne(Formateur::class);
    }

    public function apprenant() {
        return $this->hasOne(Apprenant::class);
    }

    public function inscriptionsFormateur()
{
    return $this->hasMany(Inscriptions::class, 'formateur_id');
}


}
