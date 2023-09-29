<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Chat;
use App\Models\Group;
use App\Models\Member;
use App\Events\MessageEvent;
use App\Events\MessageDeletedEvent;


class UserController extends Controller
{
    //
    public function loadDashboard(){
        $users = User::whereNotIn('id',[auth()->user()->id])->get();
        return view('dashboard',compact('users'));
    }

    public function saveChat(Request $request)
    {
        try{
           $chat = Chat::create([
                'sender_id' => $request->sender_id,
                'receiver_id' => $request->receiver_id,
                'message' => $request->message
            ]);

            event(new MessageEvent($chat));

            return response()->json([ 'success' => true,'data' =>$chat]);

        }
        catch(\Exception $e){

            return response()->json([ 'success' => false, 'msg' => $e->getMessage()]);
        }
    }

    public function loadChats(Request $request)
    {
        try{
        
            $chats = Chat::where(function($query) use ($request){
                $query->where('sender_id','=',$request->sender_id)
                ->orWhere('sender_id','=',$request->receiver_id);
            })->where(function($query) use ($request){
                $query->where('receiver_id','=',$request->sender_id)
                ->orWhere('receiver_id','=',$request->receiver_id);
            })->get();

            return response()->json([ 'success' => true,'data' => $chats ]);

        }
        catch(\Exception $e){

            return response()->json([ 'success' => false, 'msg' => $e->getMessage()]);
        }
    }


    public function deleteChat(Request $request)
    {
        try{
        
           Chat::where('id',$request->id)->delete();

           event(new MessageDeletedEvent($request->id));

            return response()->json([ 'success' => true,'msg' => 'Chats deleted Successfully' ]);

        }
        catch(\Exception $e){

            return response()->json([ 'success' => false, 'msg' => $e->getMessage()]);
        }
    }

    public function loadGroup()
    {
       $groups = Group::where('creator_id',auth()->user()->id)->get();
        return view('groups',compact('groups'));
    }

    public function createGroup(Request $request){
        try{

            Group::insert([
                'creator_id'=> auth()->user()->id,
                'name'=>$request->name,
                'join_limit'=>$request->limit
            ]);

            return response()->json([ 'success' => true, 'msg' => $request->name.' Group has been created successfully']);


        }

        catch(\Exception $e){

            return response()->json([ 'success' => false, 'msg' => $e->getMessage()]);
        }

    }

    public function getMembers(Request $request){
        try{

           $users = User::with(['groupUser'=>function($query) use($request){
            $query->where('group_id',$request->group_id);
           }])
           ->whereNotIn('id',[auth()->user()->id])->get();

            return response()->json([ 'success' => true, 'data' => $users ]);


        }

        catch(\Exception $e){

            return response()->json([ 'success' => false, 'msg' => $e->getMessage()]);
        }

    }

    public function addMembers(Request $request){
        try{

            if(!isset($request->members)){
                 return response()->json([ 'success' => false, 'msg' => 'Please selelct any one Member' ]);

            }
            else if(count($request->members) > (int)$request->limit){
                return response()->json([ 'success' => false, 'msg' => 'You cannnot select more than '.$request->limit.' ' ]);

            }
            else
            {
            
                Member::where('group_id',$request->group_id)->delete();

                $data = [];
                $x=0;
                foreach($request->members as $user){
                    $data[$x] = ['group_id'=>$request->group_id, 'user_id' => $user];
                    $x++;
                }

                Member::insert($data);


                return response()->json([ 'success' => true, 'msg' => 'Members added successfully' ]);
            }   

            
            

        }

        catch(\Exception $e){

            return response()->json([ 'success' => false, 'msg' => $e->getMessage()]);
        }

    }

    public function deleteGroup(Request $request){
        try{

           Group::where('id',$request->id)->delete();
           
            return response()->json([ 'success' => true]);


        }

        catch(\Exception $e){

            return response()->json([ 'success' => false, 'msg' => $e->getMessage()]);
        }

    }
}
