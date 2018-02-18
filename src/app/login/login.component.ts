import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { UserService } from './../user.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: String;
  password: String;
  constructor(private userService: UserService,
    private fmService: FlashMessagesService,
    private router: Router ) { }

  ngOnInit() {
  }

  login() {
    const user = {
      username: this.username,
      password: this.password
    };
    this.userService.login(user).subscribe(response => {
      const res = response.json();
      if (res.isPresent === true) {
        if ( res.correctPassword === true ) {
          localStorage.setItem('user', JSON.stringify(res.user));
          this.fmService.show('Successfully logged in', {
            cssClass: 'alert-success',
            timeout: 3000
          });
          this.router.navigate(['/']);
        } else {
          this.fmService.show('Incorrect Password', {
            cssClass: 'alert-danger',
            timeout: 3000
          });
        }
      } else {
        this.fmService.show('User not found', {
          cssClass: 'alert-danger',
          timeout: 3000
        });
      }
    });
  }

}
