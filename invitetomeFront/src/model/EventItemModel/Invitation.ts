export interface Invitation {
  eventId: string;
  operation: string; // "e.g. invitation#INV001"
  data: {
    event: any;
    eventDates: any;
    invitationContact: InvitationContact;
    invitationData: InvitationData;
    invitationDates: any;
    invitationQrData: InvitationQrData;
    invitationTemplate: InvitationTemplate;
    invitationStatus: any;
  };
}

export interface InvitationContact {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
}

export interface InvitationData {
  description: string;
  bundle: string; // Bundle operation
  createdBy: string;
  modifiedBy: string;
}

export interface InvitationQrData {
  qrCode: string;
  qrValidated: boolean;
}

export interface InvitationTemplate {
  id: string;
  subject: string;
  body: string;
}
