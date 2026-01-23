<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => env('USER_DEFAULT_NAME'),
            'email' => env('USER_DEFAULT_EMAIL'),
            'password' => Hash::make(env('USER_DEFAULT_PASSWORD')),
            'role' => 'admin'
        ]);
    }
}
