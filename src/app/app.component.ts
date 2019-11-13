import { MdbTablePaginationComponent, MdbTableDirective } from 'angular-bootstrap-md'
import { Component, OnInit, ViewChild, HostListener, AfterViewInit, ChangeDetectorRef } from '@angular/core'
import { UserService } from './user.service'
import { User } from './model/user'
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit{
  validatingForm: FormGroup;
  @ViewChild(MdbTablePaginationComponent, { static: true }) mdbTablePagination: MdbTablePaginationComponent
	@ViewChild(MdbTableDirective, { static: true }) mdbTable: MdbTableDirective
  title = 'app';
  private users: any = []
	private previous: any = []
	private headElements = ['Name', 'Age', 'Action']
  private searchText: string = ''
  

  private user
  private userEdit
  private userName: String
  private userAge: Number
  private userNameEdit: String
  private userAgeEdit: Number

  constructor(private cdRef: ChangeDetectorRef, private userService: UserService){}
  

  @HostListener('input') oninput() {
		this.searchItems()
  }
  
  ngOnInit(){
    this.getUsers()
    console.log(this.users)
    
    this.validatingForm = new FormGroup({
      subscriptionFormModalName: new FormControl('', Validators.required),
      subscriptionFormModalAge: new FormControl('', Validators.required)
    });
  }
  get subscriptionFormModalName() {
    return this.validatingForm.get('subscriptionFormModalName');
  }
  get subscriptionFormModalAge() {
    return this.validatingForm.get('subscriptionFormModalAge');
  }


  ngAfterViewInit() {
		this.mdbTablePagination.setMaxVisibleItemsNumberTo(5)
		this.mdbTablePagination.calculateFirstItemIndex()
		this.mdbTablePagination.calculateLastItemIndex()
		this.cdRef.detectChanges()
	}

	searchItems() {
		const prev = this.mdbTable.getDataSource()

		if (!this.searchText) {
			this.mdbTable.setDataSource(this.previous)
			this.users = this.mdbTable.getDataSource()
		}

		if (this.searchText) {
			this.users = this.mdbTable.searchLocalDataBy(this.searchText)
			this.mdbTable.setDataSource(prev)
		}
	}

  getUsers(){
    this.userService.getUsers().subscribe((response) => {
      this.users = response
      this.mdbTable.setDataSource(this.users)
      this.users = this.mdbTable.getDataSource()
      this.previous = this.mdbTable.getDataSource()
    })
  }

  getUser(_id){
    this.userService.getUser(_id).subscribe((response) => {
      this.user = response
    })
  }

  addUser(){
    
    const user = new User()
    user.name = this.userName
    user.age = this.userAge
    this.userService.addUser(user).subscribe((response) => {
      this.getUsers();
      

    })
  }

  editUser(_id){
    this.getUser(_id)
  }

  updateUser(){
    const userEdit = new User()
    userEdit._id = this.user._id
    userEdit.name = this.userNameEdit
    userEdit.age = this.userAgeEdit
    this.userService.updateUser(userEdit).subscribe((response) => {
      this.getUsers();
    })
  }

  deleteUser(){
    console.log(this.user)
    this.userService.deleteUser(this.user._id).subscribe((response) => {
      this.getUsers();
    })
  }

setUser(_id){
  this.userService.getUser(_id).subscribe((response)=>{
    this.user=response
    console.log(this.user)
    })
  } 
}