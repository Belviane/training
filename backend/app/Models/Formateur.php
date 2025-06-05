<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Formateur extends Model
{
    public function utilisateur() {
    return $this->belongsTo(User::class, 'utilisateur_id');
}

}
