<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Secteur extends Model
{
    /** @use HasFactory<\Database\Factories\SecteurFactory> */
    use HasFactory;

    protected $fillable = [
        'projet_id',
        'name',
        'description',
    ];

    public function projet()
    {
        return $this->belongsTo(Projet::class);
    }

    public function immeubles()
    {
        return $this->hasMany(Immeuble::class);
    }

    public function users()
    {
        return $this->hasMany(User::class);
    }
}
