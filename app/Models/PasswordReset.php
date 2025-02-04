<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PasswordReset extends Model
{
    use HasFactory;

    // Define the primary key column
    protected $primaryKey = 'email';
    protected $keyType = "string";
    public $incrementing = false;

    /**
    * The name of the "updated at" column.
    *
    * @var string
    */
    const UPDATED_AT = null;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'email',
        'token'
    ];
}
