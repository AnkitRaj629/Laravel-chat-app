
$.ajaxSetup({
    headers:{
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});

$(document).ready(function(){
    $('.user-list').click(function(){

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
});//documen ready

