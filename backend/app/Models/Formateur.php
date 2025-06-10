<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class Formateur extends Model
{
    use HasFactory;

    protected $table = 'formateurs';
    protected $fillable = [
        'specialite',
        'utilisateur_id'
    ];
    public function utilisateur() {
        return $this->belongsTo(User::class, 'utilisateur_id');
    }

}
