<?php

namespace App\Http\Controllers;

use App\Like;
use Illuminate\Http\Request;

class LikeController extends Controller
{
    public function store(Request $request){
        $data = $request->validate([
            'event_id' => 'sometimes|required|integer|exists:events,id',
            'comment_id' => 'sometimes|required|integer|exists:comments,id',
            'action' => 'required|string'
        ]);
        if (isset($data['comment_id'])){
            Like::updateOrCreate(['user_id' => auth()->id(),'comment_id' => $data['comment_id']],['action' => $data['action']]);
        }else Like::updateOrCreate(['user_id' => auth()->id(),'event_id' => $data['event_id']],['action' => $data['action']]);

        return response()->noContent();
    }
}
