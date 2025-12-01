<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;


class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'profile_picture'
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
        ];
    }

    /**
     * Append profile_picture_url to JSON
     */
    protected $appends = ['profile_picture_url'];

    /**
     * Get the full profile picture URL.
     */
    public function getProfilePictureUrlAttribute()
    {
        if (!$this->profile_picture) {
            return null;
        }

        // If already full URL, return as is
        if (str_starts_with($this->profile_picture, 'http://') || str_starts_with($this->profile_picture, 'https://')) {
            return $this->profile_picture;
        }

        // Convert relative path to full URL
        return url($this->profile_picture);
    }

    public function showcases()
    {
        return $this->hasMany(Showcase::class);
    }

    // Relasi: User punya banyak Collection
    public function collections()
    {
        return $this->hasMany(Collection::class);
    }

    // Helper cek role
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }
}
