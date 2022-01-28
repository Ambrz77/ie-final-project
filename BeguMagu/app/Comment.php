<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Morilog\Jalali\CalendarUtils;
use Morilog\Jalali\Jalalian;

class Comment extends Model
{
    use SoftDeletes;
    protected $perPage = 14;
   protected $fillable = ['user_id','event_id','content','ip'];

   public function user(){
       return $this->belongsTo(User::class);
   }
    public function event(){
        return $this->belongsTo(Event::class);
    }
    public function getDateAttribute(){
        return CalendarUtils::strftime('%A, %d %B', strtotime($this->created_at));
    }
    public function likes(){
        return $this->hasMany(Like::class,'comment_id');
    }
}
