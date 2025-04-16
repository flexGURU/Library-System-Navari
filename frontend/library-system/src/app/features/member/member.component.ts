import { Component, signal } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Member } from '../../shared/models';
import { MemberService } from '../../shared/services/member/member.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { NotificationService } from '../../shared/services/notification/notification.service';

@Component({
  selector: 'app-member',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    ToastModule,
    ConfirmDialogModule,
  ],
  templateUrl: './member.component.html',
  styleUrl: './member.component.css',
})
export class MemberComponent {
  members = signal<Member[]>([]);
  memberDialog: boolean = false;
  memberForm!: FormGroup;
  editingMember: Member | null = null;
  loading: boolean = true;

  constructor(
    private memberService: MemberService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.fetchMembers();
    this.initMemberForm();
  }

  fetchMembers(): void {
    this.loading = true;
    this.memberService.getMembers().subscribe({
      next: (response) => {
        console.log(response);

        if (typeof response === 'string') {
          this.notificationService.error(response);
        } else {
          this.members.set(response);
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching members', error);
        this.notificationService.error('Failed to load Members');
        this.loading = false;
      },
    });
  }

  initMemberForm(member?: Member): void {
    this.memberForm = this.fb.group({
      first_name: [member?.first_name || '', Validators.required],
      last_name: [member?.last_name || '', Validators.required],
      email: [member?.email || '', [Validators.required, Validators.email]],
      phone: [member?.phone || '', Validators.required],
      outstanding_debt: [member?.outstanding_debt || 0, [Validators.required]],
    });
  }

  openMemberDialog(): void {
    this.editingMember = null;
    this.initMemberForm();
    this.memberDialog = true;
  }

  editMember(member: Member): void {
    this.editingMember = member;
    this.initMemberForm(member);
    this.memberDialog = true;
  }

  saveMember(): void {
    if (this.memberForm.invalid) return;

    const memberData = this.memberForm.value;

    if (this.editingMember && this.editingMember.name) {
      this.memberService
        .updateMember(this.editingMember.name, memberData)
        .subscribe({
          next: (response) => {
            if (typeof response === 'string') {
              this.notificationService.error(response);
            } else {
              this.memberDialog = false;
              this.notificationService.success('Member updated');
              this.fetchMembers();
            }
          },
          error: (error) => {
            console.error('Error updating Member', error);
            this.notificationService.error('Failed to update Member');
          },
        });
    } else {
      this.memberService.addMember(memberData).subscribe({
        next: (response) => {
          if (typeof response === 'string') {
            this.notificationService.error(response);
          } else {
            this.fetchMembers();
            this.notificationService.success('Member has been addded');
            this.memberDialog = false;
            this.memberForm.reset();
          }
        },
        error: (error) => {
          console.error('Error adding book', error);
          this.notificationService.error(error);
        },
      });
    }
  }

  confirmDelete(member: Member): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete The Member "${member.first_name}"?`,
      accept: () => {
        console.log(member);

        if (member && member.name) {
          this.memberService.deleteMember(member.name).subscribe({
            next: (response) => {
              console.log(response);

              this.notificationService.success('Member deleted succesfully');
              this.fetchMembers();
            },
            error: (error) => {
              this.notificationService.error('Failed to delete Member');
            },
          });
        }
      },
    });
  }
}
