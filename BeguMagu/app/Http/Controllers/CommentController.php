<?php

namespace App\Http\Controllers;

use App\Comment;
use App\Community;
use App\Event;
use App\Events\NewCommentNotification;
use App\Http\Resources\Comment as CommentResource;
use App\Http\Resources\CommunityCollection;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {

    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create($id)
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return CommentResource
     */
    public function store(Request $request)
    {
        $request->validate([
            'event_id' => 'required|integer',
            'content' => 'required|string|max:1000',
        ]);
        $request->request->set('user_id',auth()->id());
        $event = Event::find($request->event_id);
        if ($event == null) return response(['error' => true,'message' => trans('messages.event_already_deleted')],404);
        if (!$event->status) return response(['error' => true,'message' => trans('messages.event_already_closed')],403);
        $request->request->set('ip',$request->ip());
        $item = Comment::create($request->all());
        return new CommentResource($item);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Comment  $comment
     * @return \Illuminate\Http\Response
     */
    public function show(Comment $comment)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Comment  $comment
     * @return \Illuminate\Http\Response
     */
    public function edit(Comment $comment)
    {

    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Comment  $comment
     * @return CommentResource
     */
    public function update(Request $request, Comment $comment)
    {
        $comment->update($request->all());
        return new CommentResource($comment);
    }

    /**
     * @param Comment $comment
     * @return \Illuminate\Http\JsonResponse
     * @throws \Exception
     */
    public function archive(Comment $comment)
    {
        $comment->delete();
        return response()->json(['error' => false,'message' => trans('messages.comment_archived')]);
    }

    /**
     * @param $id
     * @return \Illuminate\Contracts\Routing\ResponseFactory|\Illuminate\Http\Response
     */
    public function unArchive($id)
    {
        Comment::withTrashed()->find($id)->restore();
        return response(['error' => false,'message' => trans('messages.comment_unarchived')]);
    }

    /**
     * @param Comment $comment
     * @return \Illuminate\Contracts\Routing\ResponseFactory|\Illuminate\Http\Response
     */
    public function destroy(Comment $comment)
    {
        $comment->forceDelete();
        return response(['error' => false,'message' => trans('messages.comment_deleted')]);
    }
}
