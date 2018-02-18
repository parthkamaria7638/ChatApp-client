import { Router } from '@angular/router';
import { FlashMessagesModule, FlashMessagesService } from 'angular2-flash-messages';
import { UserService } from './../user.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  count: number;
  username: String;
  email: String;
  password: String;
  usernameIsEmpty: boolean;
  emailIsEmpty: boolean;
  passwordIsEmpty: boolean;
  constructor(private userService: UserService, private fmService: FlashMessagesService, private router: Router) { }

  ngOnInit() {
    this.usernameIsEmpty = false;
    this.emailIsEmpty = false;
    this.passwordIsEmpty = false;
    this.count = 0;
  }


  submitForm() {
    this.usernameIsEmpty = false;
    this.emailIsEmpty = false;
    this.passwordIsEmpty = false;
    if (this.username === undefined || this.username === '') {
      this.usernameIsEmpty = true;
      this.count++;
    }
    if (this.email === undefined || this.email === '') {
      this.emailIsEmpty = true;
      this.count++;
    }
    if (this.password === undefined || this.password === '') {
      this.passwordIsEmpty = true;
      this.count++;
    }
    if (this.count === 0) {
      const user = {
        username: this.username,
        email: this.email,
        password: this.password
      };
      this.userService.saveUser(user).subscribe(response => {
        if (response.json().user_already_signed_up === true) {
          this.fmService.show('Username already taken.', {
            cssClass: 'alert-danger',
            timeout: 3000
          });
        } else {
          this.fmService.show('Successfully signed up. You can now login', {
            cssClass: 'alert-success',
            timeout: 3000
          });
          this.router.navigate(['/login']);
        }
      });
    }
  }
}
