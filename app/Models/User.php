<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'role_id',
        'categor_id',
        'projet_id',
        'secteur_id',
        'immeuble_id',
        'appartement_id',
        'registration_completed',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'registration_completed' => 'boolean',
        ];
    }

    // Relations
    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    public function projet()
    {
        return $this->belongsTo(Projet::class);
    }

    public function secteur()
    {
        return $this->belongsTo(Secteur::class);
    }

    public function immeuble()
    {
        return $this->belongsTo(Immeuble::class);
    }

    public function appartement()
    {
        return $this->belongsTo(Appartement::class);
    }

    public function categor()
    {
        return $this->belongsTo(Categor::class);
    }

    public function reserves_assignees()
    {
        return $this->hasMany(Reserve::class, 'agent_id');
    }
}
