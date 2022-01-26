<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class CommunityUser extends Model
{
    protected $fillable = ['user_id','community_id','admin'];
}
