import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';

export const NotificationSuccess = (detail: string) => {
  const messageService = inject(MessageService);

  messageService.add({
    severity: 'success',
    summary: 'Success',
    detail,
  });
};

export const NotificationError = (detail: string | null = null) => {
  const messageService = inject(MessageService);

  messageService.add({
    severity: 'error',
    summary: 'Error',
    detail: detail ?? undefined,
  });
};
