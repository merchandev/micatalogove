<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->timestamp('stock_applied_at')->nullable()->after('completed_at');
        });

        // The previous code deducted stock when an order became completed.
        DB::table('orders')->where('status', 'completed')->update([
            'stock_applied_at' => DB::raw('COALESCE(completed_at, updated_at, created_at)'),
        ]);
    }

    public function down(): void
    {
        Schema::table('orders', fn (Blueprint $table) => $table->dropColumn('stock_applied_at'));
    }
};
