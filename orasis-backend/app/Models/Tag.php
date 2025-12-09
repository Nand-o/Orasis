<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tag extends Model
{
    use HasFactory;

    protected $fillable = ['name'];

    /**
     * Tag Model
     *
     * Tag mewakili label yang dapat di-assign ke Showcase. Digunakan untuk
     * pencarian dan filter. Relasi many-to-many ke Showcase.
     *
     * @package App\Models
     */

    // Relasi many-to-many: Tag dapat dimiliki banyak Showcase
    public function showcases()
    {
        return $this->belongsToMany(Showcase::class, 'showcase_tag');
    }
}
