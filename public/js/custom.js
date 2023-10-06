
$.ajaxSetup({
    headers:{
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});

$(document).ready(function(){
    $('.user-list').click(function(){

         // Remove any existing 'active' class from all .group-list elements
    $('.user-list').removeClass('active');

    // Add the 'active' class to the clicked .group-list element
    $(this).addClass('active');

        $('#chat-container').empty(); // Clear the chat container


        var getUserId = $(this).attr('data-id')

        receiver_id = getUserId;

        $('.start-head').hide();
        $('.chat-section').show();

        loadOldChat();

    })
    //chat form work

    $('#chat-form').submit(function(e){
        e.preventDefault();

        var message = $('#message').val();
        $.ajax({
            url:"/save-chat",
            type:"POST",
            data: { 
                sender_id:sender_id, 
                receiver_id:receiver_id, 
                message:message 
            },
            success:function(res){

                if(res.success){

                    $('#message').val('');
                    let chat = res.data.message;
                    let html = `
                    <div class="current-user-chat" id='`+res.data.id+`-chat'>
                    <p>
                       <span>`+chat+`</span>
                       <i class="fa fa-trash" aria-hidden="true" data-id='`+res.data.id+`' data-bs-toggle="modal" data-bs-target="#deleteChatModal"></i>

                    </p>
                    </div>
                    `;
                
                    $('#chat-container').append(html);
                    scrollChat();

                }
                else{
                    alert(res.msg);
                }

            }

        })
    });
    $(document).on('click','.fa-trash',function(){
        var id=$(this).attr('data-id');
        $('#delete-chat-id').val(id);
        $('#delete-message').text($(this).parent().text());
    });

    $('#delete-chat-form').submit(function(e){
        e.preventDefault();

        var id=$('#delete-chat-id').val();
        
        $.ajax({
            url:"/delete-chat",
            type:"POST",
            data:{ id:id},
            success:function(res){
                alert(res.msg);
                if(res.success){
                    $('#'+id+'-chat').remove();
                    $('#deleteChatModal').modal('hide');
                }
            }
        });

    });

});

//loadOldChat

function loadOldChat(){
    $.ajax({
        url:"/load-chats",
        type:"POST",
        data:{ sender_id: sender_id,receiver_id: receiver_id},
        success:function(res){
            if(res.success){
                let chats=res.data;
              
                let html = '';
                for(let i=0;i < chats.length; i++){
                    let addclass = '';
                    if(chats[i].sender_id== sender_id){
                        addclass = 'current-user-chat';
                    }
                    else{
                        addclass = 'distance-user-chat';
    
                    }
                     html += `
                    <div class="`+addclass+`" id='`+chats[i].id+`-chat'>
                    <p><span>`+chats[i].message+`</span>`;
                    if(chats[i].sender_id== sender_id){
                        html +=`<i class="fa fa-trash" aria-hidden="true" data-id='`+chats[i].id+`' data-bs-toggle="modal" data-bs-target="#deleteChatModal"></i>`;
                    }
                    html +=`
                    </p>
                    </div>
                    `;
                }
                $('#chat-container').append(html);
                scrollChat();

            }
            else{
                alert(res.msg);
            }
        }
    })
}

//scroll div

function scrollChat(){
    $('#chat-container').animate({
        scrollTop: $('#chat-container').offset().top + $('#chat-container')[0].scrollHeight
    },0);
}

// Echo.join('status-update')
// .here((user)=>{
//     console.log(user);
// })
// .joining(()=>{

// })
// .leaving(()=>{

// })
// .listen('UserStatusEvent',(e)=>{
//     console.log(e);
// })

//save chat work
Echo.private('broadcast-message')
.listen('.getChatMessage',(data) => {
    
if(sender_id== data.chat.receiver_id && receiver_id == data.chat.sender_id)
{
    let html =`<div class="distance-user-chat" id='`+data.chat.id+`-chat'>
    <p>`+data.chat.message+`</p>
    </div>`;

    $('#chat-container').append(html);
    scrollChat();

}
});

//delete chat-message listen

Echo.private('message-deleted')
.listen('MessageDeletedEvent' ,(data)=>{
 $('#'+data.id+'-chat').remove();
});


// chat group script

$(document).ready(function(){

    $('#createGroupForm').submit(function(e){
        e.preventDefault();

        $.ajax({
            url:"/create-group",
            type:"POST",
            data: new FormData(this),
            contentType: false,
            cache: false,
            processData: false,
            success:function(res){
                alert(res.msg);
                if(res.success){
                    location.reload();
                }
            }
        });
    });
});

function scrollGroupChat(){
    $('#group-chat-container').animate({
        scrollTop: $('#group-chat-container').offset().top + $('#group-chat-container')[0].scrollHeight
    },0);
}


//member script
$(document).ready(function(){
    $('.addMember').click(function(){

        var id = $(this).attr('data-id');
        var limit = $(this).attr('data-limit');
     
        $('#add-group-id').val(id);
        $('#add-limit').val(limit);
     
        $.ajax({
          url:"/get-member",
          type:"POST",
          data:{ group_id:id},
          success:function(res){
           
             if(res.success){
                 
                var users = res.data;
                var html = '';

                for(let i = 0; i < users.length; i++)
                {
                    let isGroupMemberChecked = '';
                    if(users[i]['group_user'] !=null){
                        isGroupMemberChecked = 'checked';
                    }
                    html +=`
                    <tr>
                        <td>
                            <input type="checkbox" name = "members[]" value="`+users[i]['id']+`" `+isGroupMemberChecked+`/>
                        </td>
                        <td>
                            `+users[i]['name']+`
                        </td>
                    </tr>
                    `
                    $(".addMembersInTable").html(html);
                }
             }
             else{
                 alert(res.msg);
             }
          }
        });
     });

     $('#add-member-form').submit(function (e){
        e.preventDefault();

        var formData = $(this).serialize();

        $.ajax({
            url:"add-member",
            type:"POST",
            data: formData,
            success:function(res){
                if(res.success){
                    $('#memberModal').modal('hide');
                    $('#add-member-form')[0].reset();
                    alert(res.msg);
                }
                else{
                    $('#add-member-error').text(res.msg);
                    setTimeout(function(){
                       $('#add-member-error').text('');
                    },3000);

                }
            }
        })

     });
     // delelte Group chat

     $('.deleteGroup').click(function(){
        $('#delete-group-id').val($(this).attr('data-id'));
        $('#group-name').text($(this).attr('data-name'));

     });

     $('#delete-group-form').submit(function (e){
        e.preventDefault();

        var formData = $(this).serialize();

        $.ajax({
            url:"/delete-group",
            type:"POST",
            data:formData,
            success: function(res)
            {
                if(res.success)
                {
                    location.reload();
                }
                else{
                    alert(res.msg);
                }
            }
      
        });

     });

  //update group working script

   $('.updateGroup').click(function(){

       $('#update-group-id').val($(this).attr('data-id'));
       $('#update-group-name').val($(this).attr('data-name'));
       $('#update-group-limit').val($(this).attr('data-limit'));
   });

   $('#updateGroupForm').submit(function(e){
        e.preventDefault();

        $.ajax({
            url:"/update-group",
            type:"POST",
            data: new FormData(this),
            contentType: false,
            cache: false,
            processData: false,
            success: function(res){
                alert(res.msg);
                if(res.success){
                    location.reload();
                }
            }
        })
   });

   //group-chat script starts here
   $('.group-list').click(function(){
    // Remove any existing 'active' class from all .group-list elements
    $('.group-list').removeClass('active');

    // Add the 'active' class to the clicked .group-list element
    $(this).addClass('active');
    var groupId = $(this).attr('data-id');

    global_group_id = groupId;


    $('#group-chat-container').empty(); // Clear the chat container

    $('.group-start-head').hide();
    $('.group-chat-section').show();

    loadGroupChats();
    
    });

    //group chat Script implemented

    $('#group-chat-form').submit(function(e){
        e.preventDefault();

        var message = $('#group-message').val();
        $.ajax({
            url:"/save-group-chat",
            type:"POST",
            data: { 
                sender_id:sender_id, 
                group_id:global_group_id, 
                message:message 
            },
            success:function(res){
                if(res.success){

                    $('#group-message').val('');
                    let chat = res.data.message;
                    let html = `
                    <div class="current-user-chat" id='`+res.data.id+`-chat'>
                    <p>
                       <span>`+chat+`</span>

                    </p>`
                    let timestamp = new Date(res.data.created_at);

                
                    let formattedDate = timestamp.toLocaleDateString('en-GB');  
                    let formattedTime = timestamp.toLocaleTimeString('en-GB');
                    html +=`<div class="user-data">`;
                    html +=`<b>Me</b>`;
                    html += ` `  + formattedDate +`  `+formattedTime+``;
                    html+=`</div>`;
                    html+=`</div>`;
                    $('#group-chat-container').append(html);
                    scrollGroupChat();

                }
                else{
                    alert(res.msg);
                }

            }

        })
    });
   
});//documen ready

Echo.private('broadcast-group-message')
.listen('.getGroupChatMessage',(data) => {
    
if(sender_id != data.chat.sender_id && global_group_id == data.chat.group_id)
{
    let html =`<div class="distance-user-chat" id='`+data.chat.id+`-chat'>
    <p>`+data.chat.message+`</p>`
    let timestamp = new Date(data.chat.user_data.created_at);

                
    let formattedDate = timestamp.toLocaleDateString('en-GB');  
    let formattedTime = timestamp.toLocaleTimeString('en-GB');
    html +=`<div class="user-data">`;
    html +=`<b>`+data.chat.user_data.name+`</b>`;
    html += ` `  + formattedDate +`  `+formattedTime+``;
    html+=`</div>`;
    html+=`</div>`;

    $('#group-chat-container').append(html);
    scrollGroupChat();

}
});

 function loadGroupChats(){

    $('#group-chat-container').html('');

    $.ajax({
        url:"/load-group-chats",
        type:"POST",
        data:{ group_id: global_group_id},
        success:function(res){
    

            if(res.success){
                let chats = res.chats;
                let html = '';
               
                for(let i= 0; i < chats.length; i++){
                    let addclass = 'distance-user-chat';
                   
                    if(chats[i].sender_id ==  sender_id){
                    addclass = 'current-user-chat';

                    }
                    let timestamp = new Date(chats[i].created_at);

                
                    let formattedDate = timestamp.toLocaleDateString('en-GB');  
                    let formattedTime = timestamp.toLocaleTimeString('en-GB');

                    html += `<div class="`+addclass+`" id='`+chats[i].id+`-chat'>`;


                    html += `<p>`+chats[i].message+`</p>`

                    
                    html +=`
                    <div class="user-data">`;
                    if(chats[i].sender_id ==  sender_id){
                        html +=`<b>Me</b>`;
    
                        }
                    else{
                        html +=`<b>`+chats[i].user_data.name+`</b>`;
                    }    
                    html += ` `  + formattedDate +`  `+formattedTime+``;
                    
                    html +=`</div>`;
                    html +=`</div>`;
                    html +=` `;
                }

                $('#group-chat-container').append(html);
                scrollGroupChat();
            
            }
            else{
                alert(res.msg);
            }
        }
    });
}