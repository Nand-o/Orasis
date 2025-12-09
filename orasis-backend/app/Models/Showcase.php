<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Showcase extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'url_website',
        'image_url',
        'logo_url',
        'category_id',
        'status',
        'views_count',
    ];
    /**
     * Showcase Model
     *
     * Representasi karya/design yang diunggah user. Menyimpan informasi
     * seperti title, description, image_url, logo_url, kategori, status,
     * dan jumlah views.
     *
     * Relasi:
     * - belongsTo User
     * - belongsTo Category
     * - belongsToMany Tag
     * - belongsToMany Collection
     *
     * @package App\Models
     */

    // Relasi ke User (pemilik showcase)
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relasi ke Category
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    // Relasi many-to-many: Showcase punya banyak Tag
    public function tags()
    {
        return $this->belongsToMany(Tag::class, 'showcase_tag');
    }

    // Relasi many-to-many: Showcase bisa dimasukkan ke banyak Collection
    public function collections()
    {
        return $this->belongsToMany(Collection::class, 'collection_showcase');
    }
}
