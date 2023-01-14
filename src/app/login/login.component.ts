import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private authService : AuthService, private formBuilder : FormBuilder) { 
    this.loginForm = formBuilder.group({
      email : ['', Validators.required],
      password : ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  loginForm! : FormGroup
  loginError : string = '';

  handleSubmit = async () => {
    const { value } = this.loginForm;
 
    let attempt = await this.authService.login(value.email, value.password);

    if(attempt != '')
    {
      // there was an error
      this.loginError = attempt;
    }
  }

  isLoading = () => {
    this.authService.isLoading;
  }


}
