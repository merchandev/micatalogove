<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $user = \App\Models\User::factory()->create([
            'name' => 'Arturo Merchán',
            'email' => 'admin@micatalogo.com',
            'password' => bcrypt('password123'),
        ]);

        $tenant = \App\Models\Tenant::create([
            'user_id' => $user->id,
            'name' => 'Arturo Store',
            'domain' => 'arturomerchan18',
            'whatsapp_number' => '584121234567',
            'store_description' => 'La mejor tienda online.',
        ]);

        $category = \App\Models\Category::create([
            'tenant_id' => $tenant->id,
            'name' => 'Electrónica',
            'slug' => 'electronica'
        ]);

        \App\Models\Product::create([
            'tenant_id' => $tenant->id,
            'category_id' => $category->id,
            'name' => 'Laptop Gamer',
            'description' => 'Potente laptop para gaming.',
            'price' => 1200.00,
            'status' => 'active'
        ]);
        
        \App\Models\Product::create([
            'tenant_id' => $tenant->id,
            'category_id' => $category->id,
            'name' => 'Mouse Inalámbrico',
            'description' => 'Mouse ergonómico.',
            'price' => 25.50,
            'status' => 'active'
        ]);
    }
}
