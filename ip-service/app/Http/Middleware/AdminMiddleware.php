<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $userId = $request->header('x-user-id');
        $role   = $request->header('x-user-role');

        if (!$userId || !$role) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        if ($role !== 'admin') {
            return response()->json(['error' => 'Forbidden'], 403);
        }

        return $next($request);
    }
}
