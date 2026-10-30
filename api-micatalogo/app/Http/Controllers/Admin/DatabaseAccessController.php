<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;

class DatabaseAccessController extends Controller
{
    public function __invoke()
    {
        return response()->json([
            'url' => config('services.phpmyadmin.url', 'http://localhost:8080'),
            'database' => config('database.connections.mysql.database'),
            'username' => config('database.connections.mysql.username'),
        ]);
    }
}
