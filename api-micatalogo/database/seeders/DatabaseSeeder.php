<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use RuntimeException;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        if (! app()->isProduction()) {
            $this->call(DemoSeeder::class);

            return;
        }

        $email = config('seeding.superadmin_email');
        $password = config('seeding.superadmin_password');
        if (! is_string($email) || ! filter_var($email, FILTER_VALIDATE_EMAIL)
            || ! is_string($password) || strlen($password) < 16) {
            throw new RuntimeException('Set SEED_SUPERADMIN_EMAIL and a SEED_SUPERADMIN_PASSWORD of at least 16 characters.');
        }

        // Never reset an existing account or promote an existing lower-privilege user.
        $user = User::where('email', $email)->first();
        if ($user) {
            if ($user->role !== User::ROLE_SUPERADMIN) {
                throw new RuntimeException('The bootstrap email belongs to a non-superadmin account.');
            }

            return;
        }

        User::create([
            'email' => $email,
            'name' => 'Superadmin MiCatalogo',
            'password' => Hash::make($password),
            'role' => User::ROLE_SUPERADMIN,
            'status' => User::STATUS_ACTIVE,
            'approved_at' => now(),
        ]);
    }
}
