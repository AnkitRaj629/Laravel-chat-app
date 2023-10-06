<x-app-layout>

    <div class="container mt-4">
        <h1 style="font-size: 30px">Groups</h1>


        <!-- Button trigger modal -->
        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#createGroupModal">
            Create Group
        </button>

        <table class="table">
            <thead>
                <tr>
                    <th>S.no</th>
                    <th>Name</th>
                    <th>Limit</th>
                    <th>Members</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                @if (count($groups)>0)
                    @php
                        $i=0;
                    @endphp
                    @foreach ($groups as $group )
                        
                        <tr>
                            <td>{{++$i}}</td>
                            <td>{{$group->name}}</td>
                            <td>{{$group->join_limit}}</td>
                            <td><a style="cursor:pointer" class="addMember" data-limit="{{$group->join_limit}}" data-id="{{$group->id}}" data-bs-toggle="modal" data-bs-target="#memberModal">Members</a></td>
                            <td>
                                <i class="fa fa-trash deleteGroup" aria-hidden="true" data-id="{{$group->id}}" data-name="{{$group->name}}" data-bs-toggle="modal" data-bs-target="#deleteGroupModal"></i>
                                <i class="fa fa-pencil updateGroup" aria-hidden="true" data-id="{{$group->id}}" data-name="{{$group->name}}" data-limit="{{$group->join_limit}}" data-bs-toggle="modal" data-bs-target="#updateGroupModal"></i>
                            </td>
                        </tr>

                    @endforeach

                @else
                    <tr>
                        <th colspan="5">No Group found!</th>
                    </tr>
                @endif
            </tbody>
        </table>
        <!-- Modal -->
        

        <div class="modal fade" id="createGroupModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">Create Group</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <form enctype="multipart/form-data" id="createGroupForm">
                        <div class="modal-body">
                            
                            <input type="text" name="name" placeholder="Enter Group Name" required class="w-100 mb-2">
                            <input type="number" name="limit" min="1" placeholder="Enter User Limit" required class="w-100 mb-2">

                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="submit" class="btn btn-primary">Create</button>
                        </div>
                    </form>    
                </div>
            </div>
        </div>

                   
    

        {{-- end --}}
        {{--modal for adding member in group--}}
        <div class="modal fade" id="memberModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">Members</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <form id="add-member-form">
                        <div class="modal-body">
                            
                          <input type="hidden" name="group_id" id="add-group-id">
                          <input type="hidden" name="limit" id="add-limit">

                          <table class="table">
                            <thead>
                                <tr>
                                    <th>Select</th>
                                    <th>Name</th>
                                </tr>
                            </thead>   
                          </table>
                          <tbody>
                            <tr>
                                <td colspan="">
                                    <div class="addMemberTable">
                                        <table class="table addMembersInTable">

                                            
                                        </table>
                                    </div>
                                </td>
                            </tr>
                          </tbody>

                        </div>
                        <div class="modal-footer">
                            <span id="add-member-error"></span>
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="submit" class="btn btn-primary">Add Member</button>
                        </div>
                    </form>    
                </div>
            </div>
        </div>

         {{-- Modal for deleting group           --}}
         <div class="modal fade" id="deleteGroupModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">Delete Group</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <form id="delete-group-form">
                        <div class="modal-body">
                            
                          <input type="hidden" name="id" id="delete-group-id">
                          <p>Are you sure you want to delete <b id="group-name"></b> Group?</p>

                        </div>
                        <div class="modal-footer">
                            <span id="add-member-error"></span>
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="submit" class="btn btn-danger">Delete Group</button>
                        </div>
                    </form>    
                </div>
            </div>
        </div>
        {{-- modal end --}}

        {{-- update group modal --}}

        <div class="modal fade" id="updateGroupModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">Update Group</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <form enctype="multipart/form-data" id="updateGroupForm">
                        <div class="modal-body">
                            <input type="hidden" name="id" id="update-group-id">
                            <input type="text" name="name" id="update-group-name" placeholder="Enter Group Name" required class="w-100 mb-2">
                            <input type="number" name="limit" id="update-group-limit" min="1" placeholder="Enter User Limit" required class="w-100 mb-2">
                            <p>If you reduce the limit of group then every member will be deleted</p>

                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="submit" class="btn btn-primary">Update</button>
                        </div>
                    </form>    
                </div>
            </div>
        </div>

    </div>


</x-app-layout>