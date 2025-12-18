<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Collection extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
    ];

    /**
     * Collection Model
     *
     * Representasi folder koleksi milik user. Collection menyimpan daftar
     * showcase yang disimpan/bookmarked oleh user.
     *
     * @package App\Models
     */

    // Relasi ke User (Pemilik Koleksi)
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relasi many-to-many: Collection berisi banyak Showcase
    public function showcases()
    {
        return $this->belongsToMany(Showcase::class, 'collection_showcase')
                    ->withTimestamps(); // Agar created_at di tabel pivot terisi
    }
}
