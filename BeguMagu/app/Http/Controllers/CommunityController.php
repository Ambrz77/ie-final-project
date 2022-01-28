<?php

namespace App\Http\Controllers;

use App\Community;
use App\CommunityUser;
use App\Event;
use App\Http\Resources\CommentCollection;
use App\Http\Resources\Community as CommunityResource;
use App\Http\Resources\communityCollection;
use App\Http\Resources\EventCollection;
use Illuminate\Http\Request;

class CommunityController extends Controller
{
    public function index()
    {
        $data = Community::query();
        if(request()->get('name'))$data = $data->where('name','LIKE','%' . request()->get('name') . '%');
        if(request()->get('hot'))$data = $data->orderByDesc('views');
        $data = $data->latest()->paginate();
        return new CommunityCollection($data);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return CommunityResource
     */
    public function store(Request $request)
    {
        $request->request->set('user_id',auth()->user()->getAuthIdentifier());
        $request->validate([
            'name' => 'required|string|max:30',
            'description' => 'required|string|max:191',
        ]);
        $item = Community::create($request->all());
        return new CommunityResource($item);
    }

    /**
     * Display the specified resource.
     *
     * @param Community $community
     * @return EventCollection
     */
    public function show(Community $community)
    {
        $community->update(['views' => $community->views + 1]);
        $data = Event::where('community_id',$community->id);
        if ($title = request()->get('title'))$data->where('title','like','%' . $title . '%');
        $data = $data->latest()->paginate();
        return (new EventCollection($data))->additional([
            'community' => new CommunityResource($community),
            'is_join' => CommunityUser::where('community_id',$community->id)->where('user_id',auth()->id())->count() > 0,
            'is_admin' => $community->user_id == auth()->id()

        ]);
    }

    public function user(){
        $community_ids = CommunityUser::where('user_id',auth()->id())->pluck('community_id');
        $data = Community::where('user_id',auth()->id())->orWhereIN('id',$community_ids)->latest()->get();
        return new CommunityCollection($data);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param Community $community
     * @return CommunityResource
     */
    public function edit(Community $community)
    {
        return new CommunityResource($community);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @param Community $community
     * @return CommunityResource
     */
    public function update(Request $request, Community $community)
    {
        $request->validate([
            'name' => 'required|string|max:30',
            'description' => 'required|string|max:191',
        ]);
        $community->update($request->all());
        return new CommunityResource($community);
    }

    /**
     * Remove the specified resource from storage.
     * @param Community $community
     * @return \Illuminate\Contracts\Routing\ResponseFactory|\Illuminate\Http\Response
     * @throws \Exception
     */
    public function destroy(Community $community)
    {
        $community->delete();
        return response(['error' => false,'message' => trans('messages.community_deleted')]);
    }
}
