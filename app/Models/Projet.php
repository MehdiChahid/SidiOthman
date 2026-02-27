<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Projet extends Model
{
    /** @use HasFactory<\Database\Factories\ProjetFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'location',
        'start_date',
        'end_date',
        'status',
        'user_id',
    ];

    public function secteurs()
    {
        return $this->hasMany(Secteur::class);
    }

    public function users()
    {
        return $this->hasMany(User::class);
    }
}
