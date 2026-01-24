<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\RefreshToken;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        Log::info("CREDS", $request->only(['email', 'password']));
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        if (!$token = auth()-> attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized', 401]);
        }

        $refreshToken = Str::random(64);

        RefreshToken::create([
            'user_id' => auth()->user()->id,
            'token' => $refreshToken,
            'expires_at' => Carbon::now()->addDays(7)
        ]);

        return $this->createResponse($token, $refreshToken);
    }

    public function refresh(Request $request)
    {
        $request->validate([
            'refresh_token' => 'required'
        ]);

        $storedToken = RefreshToken::where('token', $request->refresh_token)
            ->where('expires_at', '>', now())
            ->first();

        if (!$storedToken) {
            return response()->json(['error' => 'Invalid refresh token'], 401);
        }

        return $this->createResponse(auth()->refresh(), $request->refresh_token);
    }

    public function logout(Request $request)
    {
        $user = auth()->user();

        RefreshToken::where('user_id', $user->id)->delete();

        auth()->logout();

        return response()->json(['message' => 'Successfully logged out!']);
    }

    public function me()
    {
        return response()->json(new UserResource(auth()->user()));
    }

    protected function createResponse($token, $refreshToken)
    {
        return response()->json([
            'access_token' => $token,
            'refresh_token' => $refreshToken,
            'auth_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60,
            'user' => new UserResource(auth()->user())
        ]);
    }
}
