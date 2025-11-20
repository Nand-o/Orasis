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

    // Relasi ke User (Pemilik Koleksi)
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relasi ke Showcase (Isi Koleksi)
    public function showcases()
    {
        return $this->belongsToMany(Showcase::class, 'collection_showcase')
                    ->withTimestamps(); // <--- PENTING: Agar created_at di tabel pivot terisi
    }
}