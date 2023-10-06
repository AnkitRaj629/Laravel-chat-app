<x-app-layout>

    <div class="container mt-4">

        <div class="row">
            @if (isset($groups) && count($groups) > 0 || isset($joinedGroups) && count($joinedGroups) > 0)
    
                <div class="col-md-3">
                    <ul class="list-group">
                        @foreach ($groups as $group)
                            <li class="list-group-item list-group-item-dark group-list" data-id="{{$group->id}}">
                                {{$group->name}}
                             
                            </li>
                        @endforeach

                        {{-- joined group show --}}
                        @foreach ($joinedGroup as $group)
                        <li class="list-group-item list-group-item-dark group-list" data-id="{{$group->getGroup->id}}">
                            {{$group->getGroup->name}}
                         
                        </li>
                    @endforeach

                    </ul>
                </div>
                <div class="col-md-9">
                    <h4 class="group-start-head">Click to start the chat</h4>

                    <div class="group-chat-section">

                        <div id="group-chat-container">
                            
                            {{-- <div class="distance-user-chat">
                                <h4>Hello from ankit</h4>
                            </div> --}}
                        </div>

                                <form action="" id="group-chat-form">
                                    <input type="text" name="message" placeholder="Enter Message" id="group-message" class="border" required>
                                    <input type="submit" value="Send Message" class="btn btn-primary">
                                </form>
                            </div>
                        </div>
                            
            @else

            <div class="col-md-12">
                <h6>Group not Found!</h6>
            </div>
                
            @endif
        </div>

    </div>

  
</x-app-layout>
