<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Laravel\Sanctum\PersonalAccessToken;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;


class AuthController extends Controller
{
    /**
     * Generate CSRF token.
     */
    public function getCsrfToken(Request $request)
    {
        // Generate a new CSRF token
        $token = csrf_token();

        // Return the token inside a cookie
        return response()->json($token)
            ->cookie('XSRF-TOKEN', $token, 60, '/', null, false, true); // 60 min expiration
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
        $token = $user->createToken('Personal Access Token')->plainTextToken;

        // $abilities = $user->whichPermission();
        $abilities = $user->whichRole();

        // $rules = {};

        return response()->json([
            'message' => 'Authenticated successfully',
            'accessToken' => $token,
            'userData' => $user->toArray(),
            'userAbilityRules' => $abilities,

        ]);
    }

    /**
     * Register and return session.
     */
    public function register(Request $request)
    {
        // Validate input fields
        $validator = $request->validate([
            'name' => 'required|min:6',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:8', 
            'password_confirmation' => 'required_with:password|same:password|min:8'
        ]);

        // Create user
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => User::ROLE_USER,
        ]);

        // Log the user in and issue a token (if needed)
        auth()->login($user);
        $token = $user->createToken('Personal Access Token')->plainTextToken;

        return response()->json(['user' => $user, 'accessToken' => $token, 'message' => 'Registration successful']);
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
