<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Apprenant extends Model
{
    public function utilisateur()
{
    return $this->belongsTo(User::class);
}
}
