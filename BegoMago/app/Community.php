<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Community extends Model
{
    protected $fillable = ['user_id','name','description','views'];

    public function events(){
        return $this->hasMany(Event::class);
    }
}
