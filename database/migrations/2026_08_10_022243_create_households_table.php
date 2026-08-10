<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('households', function (Blueprint $table) {
            $table->id();
            $table->string('fathers_name');
            $table->string('mothers_name');
            $table->string('fathers_occupation');
            $table->string('mothers_occupation');
            $table->string('home_address');
            $table->decimal('family_income', 10, 2);
            $table->enum('house_status', ['rent', 'owned', 'living_together_with_parents', 'others', 'separated'])->default('rent');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('households');
    }
};
