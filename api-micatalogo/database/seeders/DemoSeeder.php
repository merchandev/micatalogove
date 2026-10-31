<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DemoSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        if (app()->isProduction()) {
            throw new \RuntimeException('Demo seeding is disabled in production.');
        }

        $superadmin = User::updateOrCreate(
            ['email' => 'superadmin@micatalogo.com'],
            [
                'name' => 'Superadmin MiCatalogo',
                'password' => Hash::make('password123'),
                'role' => User::ROLE_SUPERADMIN,
                'status' => User::STATUS_ACTIVE,
                'approved_at' => now(),
            ]
        );

        User::updateOrCreate(
            ['email' => 'admin@micatalogo.com'],
            [
                'name' => 'Administrador MiCatalogo',
                'password' => Hash::make('password123'),
                'role' => User::ROLE_ADMIN,
                'status' => User::STATUS_ACTIVE,
                'approved_at' => now(),
                'approved_by' => $superadmin->id,
            ]
        );

        $client = User::updateOrCreate(
            ['email' => 'cliente@micatalogo.com'],
            [
                'name' => 'Cliente Demo',
                'password' => Hash::make('password123'),
                'role' => User::ROLE_CLIENT,
                'status' => User::STATUS_ACTIVE,
                'approved_at' => now(),
                'approved_by' => $superadmin->id,
            ]
        );

        if (! $client->hasVerifiedEmail()) {
            $client->markEmailAsVerified();
        }

        $tenant = Tenant::updateOrCreate(
            ['domain' => 'arturomerchan18'],
            [
                'user_id' => $client->id,
                'name' => 'Arturo Store',
                'whatsapp_number' => '584121234567',
                'store_description' => 'La mejor tienda online.',
                'theme' => 'tech-demo',
                'status' => Tenant::STATUS_ACTIVE,
            ]
        );

        $category = Category::updateOrCreate(
            [
                'tenant_id' => $tenant->id,
                'slug' => 'electronica',
            ],
            [
                'name' => 'Electronica',
            ]
        );

        Product::updateOrCreate(
            [
                'tenant_id' => $tenant->id,
                'name' => 'Laptop Gamer',
            ],
            [
                'category_id' => $category->id,
                'description' => 'Potente laptop para gaming.',
                'sku' => 'LAP-GAMER-001',
                'price' => 1200.00,
                'stock_quantity' => 7,
                'low_stock_threshold' => 3,
                'status' => 'active',
            ]
        );

        Product::updateOrCreate(
            [
                'tenant_id' => $tenant->id,
                'name' => 'Mouse Inalambrico',
            ],
            [
                'category_id' => $category->id,
                'description' => 'Mouse ergonomico.',
                'sku' => 'MOU-WIRE-001',
                'price' => 25.50,
                'stock_quantity' => 18,
                'low_stock_threshold' => 5,
                'status' => 'active',
            ]
        );
    }
}
