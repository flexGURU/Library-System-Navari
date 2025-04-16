import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private messageService: MessageService) {}

  success = (detail: string) => {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail,
    });
  };

  error = (detail: string | null = null) => {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: detail ?? undefined,
    });
  };
}
