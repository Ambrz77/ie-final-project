<?php

namespace App\Http\Controllers;

use App\Community;
use App\CommunityUser;
use App\Http\Resources\Event as EventResource;
use App\Http\Resources\EventCollection;
use App\Event;
use App\Http\Resources\EventWithComment;
use Illuminate\Http\Request;

class EventController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return EventCollection
     */

    public function index(){
        $communityIds = CommunityUser::where('user_id',auth()->id())->pluck('community_id');
        $communityIds = $communityIds->merge(Community::where('user_id',auth()->id())->pluck('id'));
        $data = Event::withCount(['likes','comments'])->whereIn('community_id',$communityIds);
        if ($title = request()->get('title'))$data->where('title','like','%' . $title . '%');
        if (request()->get('sort') == 'like')$data = $data->latest('likes_count');
        elseif (request()->get('sort') == 'comment')$data = $data->latest('comments_count');
        $data = $data->latest()->paginate();
        return new EventCollection($data);
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
     * @return EventResource
     */
    public function store(Request $request)
    {
        $request->request->set('user_id',auth()->id());
        $request->request->set('ip',$request->ip());
        $request->validate([
            'community_id' => 'required|integer|exists:communities,id',
            'title' => 'required|string|max:191',
            'description' => 'required|string|max:10000',
        ]);
        $item = Event::create($request->all());
        return new EventResource($item);
    }

    /**
     * Display the specified resource.
     *
     * @param Event $event
     * @return EventWithComment
     */
    public function show(Event $event)
    {
        return new EventWithComment($event);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param Event $event
     * @return EventResource
     */
    public function edit(Event $event)
    {
        return new EventResource($event);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @param Event $event
     * @return EventResource
     */
    public function update(Request $request, Event $event)
    {
        $data = $request->validate([
            'title' => 'required|string|max:191',
            'description' => 'required|string|max:10000',
        ]);
        $event->update($data);
        return new EventResource($event);
    }

    /**
     * Remove the specified resource from storage.
     * @param Event $event
     * @return \Illuminate\Contracts\Routing\ResponseFactory|\Illuminate\Http\Response
     * @throws \Exception
     */
    public function destroy(Event $event)
    {
        $event->delete();
        return response(['error' => false,'message' => trans('messages.event_deleted')]);
    }
}
