import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from './../user.service';
import { WebsocketService } from './../websocket.service';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.css']
})
export class ChatroomComponent implements OnInit {
  private username: String;
  private email: String;
  private chatroom;
  private message: String;
  messageArray: Array<{user: String, message: String}> = [];
  private isTyping = false;

  constructor(
    private route: ActivatedRoute,
    private webSocketService: WebsocketService,
    private userService: UserService,
    private router: Router
  ) {
    this.webSocketService.newMessageReceived().subscribe(data => {
      this.messageArray.push(data);
      this.isTyping = false;
    });
    this.webSocketService.receivedTyping().subscribe(bool => {
      this.isTyping = bool.isTyping;
    });
  }

  ngOnInit() {
    this.username = this.route.snapshot.queryParamMap.get('name');
    this.email = this.route.snapshot.queryParamMap.get('email');
    const currentUser = this.userService.getLoggedInUser();
    if ( currentUser.username < this.username) {
      this.chatroom = currentUser.username.concat(this.username);
    } else {
      this.chatroom = this.username.concat(currentUser.username);
    }
    this.webSocketService.joinRoom({user: this.userService.getLoggedInUser().username, room: this.chatroom});
    this.userService.getChatRoomsChat(this.chatroom).subscribe(messages => {
      this.messageArray = messages.json();
    });
  }

  sendMessage() {
    this.webSocketService.sendMessage({room: this.chatroom, user: this.userService.getLoggedInUser().username, message: this.message});
    this.message = '';
  }

  typing() {
    this.webSocketService.typing({room: this.chatroom, user: this.userService.getLoggedInUser().username});
  }

}
