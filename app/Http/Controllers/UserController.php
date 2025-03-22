<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Laravel\Sanctum\PersonalAccessToken;
use App\Models\User;

class UserController extends Controller
{
     /**
     * Generate CSRF token.
     */
    public function getCsrfToken(Request $request)
    {
        return response()->json(['message' => 'CSRF token set']);
    }
    
    /**
     * Authenticate user and return Sanctum session-based token.
     */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (!Auth::attempt($credentials)) {
            return response()->json(['error' => 'Invalid credentials'], 401);
        }

        $user = Auth::user();

        return response()->json([
            'message' => 'Authenticated successfully',
            'user' => $user,
        ]);
    }

    /**
     * Logout user and revoke session.
     */
    public function logout(Request $request)
    {
        Auth::guard('web')->logout();
        return response()->json(['message' => 'Logged out successfully']);
    }
}
