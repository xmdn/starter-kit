<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, HasApiTokens, Notifiable;

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
    ];

    // Define constants for roles for easier reference
    const ROLE_ADMIN = 'admin';
    const ROLE_USER = 'user';
    const ROLE_GUEST = 'guest';

    // Define a method to check if the user is an admin
    public function whichRole()
    {
        switch ($this->role) {
            case self::ROLE_ADMIN:
                return self::ROLE_ADMIN;
                break;
            case self::ROLE_USER:
                return self::ROLE_USER;
                break;
            case self::ROLE_GUEST:
                return self::ROLE_GUEST;
                break;
            default:
                return self::ROLE_USER;
        }
    }

    public function whichPermission()
    {
        $role = $this->whichRole(); // Assume `role` is a field in your user model
    
        $abilities = [];

        if ($role === 'admin') {
            // Admin has full access
            $abilities = [
                'can' => [
                    ['read', 'Post'],
                    ['update', 'Post'],
                    ['delete', 'Post'],
                    ['read', 'Comment'],
                    ['update', 'Comment'],
                    ['delete', 'Comment'],
                ],
            ];
        } elseif ($role === 'user') {
            // Editor has limited access
            $abilities = [
                'can' => [
                    ['read', 'Post'],
                    ['update', 'Post'],
                    ['read', 'Comment'],
                    ['update', 'Comment'],
                ],
                'cannot' => [
                    ['delete', 'Post', ['published' => true]],
                    ['delete', 'Comment', ['published' => true]],
                ],
            ];
        } elseif ($role === 'guest') {
            // Guest has read-only access
            $abilities = [
                'can' => [
                    ['read', 'Post'],
                    ['read', 'Comment'],
                ],
            ];
        }

        return $abilities;
    }

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
     * Define a relationship to the Post model (one-to-many).
     */
     public function posts()
     {
         return $this->hasMany(Post::class); // A user can have many posts
     }

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
}
