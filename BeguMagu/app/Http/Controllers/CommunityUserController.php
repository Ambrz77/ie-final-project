<?php

namespace App\Http\Controllers;

use App\Community;
use App\CommunityUser;
use Illuminate\Http\Request;

class CommunityUserController extends Controller
{
    public function store(Request $request){
        $data = $request->validate([
            'community_id' => 'required|integer|exists:communities,id'
        ]);
        $data['user_id'] = auth()->id();
        CommunityUser::create($data);
        return response()->json(['error' => false,'message' => __('Community User Added')]);
    }
    public function destroy($id){
        CommunityUser::where('community_id',$id)->where('user_id',auth()->id())->delete();
        return response()->json(['error' => false,'message' => __('Community User deleted')]);
    }
}
