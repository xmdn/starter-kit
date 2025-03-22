<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Post extends Model
{
    use HasFactory;

    // The table associated with the model.
    protected $table = 'posts';

    // The attributes that are mass assignable.
    protected $fillable = ['user_id', 'title', 'description', 'created_at', 'updated_at'];

    // Define a relationship to the User model (many-to-one)
    public function user()
    {
        return $this->belongsTo(User::class); // A post belongs to a user
    }
}
