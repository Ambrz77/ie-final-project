<?php

namespace App;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Morilog\Jalali\CalendarUtils;
use Morilog\Jalali\Jalalian;

class Event extends Model
{
    use SoftDeletes;

    protected $perPage = 14;
    protected $fillable = ['user_id','community_id','title','description','status','ip'];

    public function community(){
        return $this->belongsTo(Community::class,'community_id');
    }

    public function user(){
        return $this->belongsTo(User::class);
    }

    public function comments(){
        return $this->hasMany(Comment::class);
    }

    public function likes(){
        return $this->hasMany(Like::class,'event_id');
    }
}
