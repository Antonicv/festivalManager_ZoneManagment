import { Quota } from "../../../model/EventItemModel/Core";

// State interface
export interface QuotaStateForm {
  quotas: Quota[];
  totalInvitations: number;
  remainingInvitations: number; // Invitations left to allocate
}

// Action types
export const QUOTA_ACTIONS = {
  NEW_QUOTA: "NEW_QUOTA",
  TOTAL_CHANGE: "TOTAL_CHANGE",
  DELETE_QUOTA: "DELETE_QUOTA",
  CHANGE_QUOTA_QTY: "CHANGE_QUOTA_QTY",
} as const;

// Action interfaces
export interface NewQuotaAction {
  type: typeof QUOTA_ACTIONS.NEW_QUOTA;
  payload: Quota;
}

export interface TotalChangeAction {
  type: typeof QUOTA_ACTIONS.TOTAL_CHANGE;
  payload: number;
}

export interface DeleteQuotaAction {
  type: typeof QUOTA_ACTIONS.DELETE_QUOTA;
  payload: string; // invitationType
}

export interface ChangeQuotaQtyAction {
  type: typeof QUOTA_ACTIONS.CHANGE_QUOTA_QTY;
  payload: {
    invitationType: string;
    quantity: number;
  };
}

export type QuotaAction =
  | NewQuotaAction
  | TotalChangeAction
  | DeleteQuotaAction
  | ChangeQuotaQtyAction;

// Helper function to calculate remaining invitations
const calculateRemainingInvitations = (
  totalInvitations: number,
  quotas: Quota[]
): number => {
  const allocatedInvitations = quotas.reduce(
    (sum, quota) => sum + quota.quotaQuantity,
    0
  );
  return totalInvitations - allocatedInvitations;
};

// Reducer function
export const quotaReducer = (
  state: QuotaStateForm,
  action: QuotaAction
): QuotaStateForm => {
  switch (action.type) {
    case QUOTA_ACTIONS.NEW_QUOTA: {
      const updatedQuotas = [...state.quotas, action.payload];
      return {
        ...state,
        quotas: updatedQuotas,
        remainingInvitations: calculateRemainingInvitations(
          state.totalInvitations,
          updatedQuotas
        ),
      };
    }

    case QUOTA_ACTIONS.TOTAL_CHANGE: {
      return {
        ...state,
        totalInvitations: action.payload,
        remainingInvitations: calculateRemainingInvitations(
          action.payload,
          state.quotas
        ),
      };
    }

    case QUOTA_ACTIONS.DELETE_QUOTA: {
      const updatedQuotas = state.quotas.filter(
        (quota) => quota.invitationType !== action.payload
      );
      return {
        ...state,
        quotas: updatedQuotas,
        remainingInvitations: calculateRemainingInvitations(
          state.totalInvitations,
          updatedQuotas
        ),
      };
    }

    case QUOTA_ACTIONS.CHANGE_QUOTA_QTY: {
      const updatedQuotas = state.quotas.map((quota) =>
        quota.invitationType === action.payload.invitationType
          ? { ...quota, quotaQuantity: action.payload.quantity }
          : quota
      );
      return {
        ...state,
        quotas: updatedQuotas,
        remainingInvitations: calculateRemainingInvitations(
          state.totalInvitations,
          updatedQuotas
        ),
      };
    }

    default:
      return state;
  }
};

// Action creators
export const addNewQuota = (quota: Quota): NewQuotaAction => ({
  type: QUOTA_ACTIONS.NEW_QUOTA,
  payload: quota,
});

export const changeTotalInvitations = (total: number): TotalChangeAction => ({
  type: QUOTA_ACTIONS.TOTAL_CHANGE,
  payload: total,
});

export const deleteQuota = (invitationType: string): DeleteQuotaAction => ({
  type: QUOTA_ACTIONS.DELETE_QUOTA,
  payload: invitationType,
});

export const changeQuotaQuantity = (
  invitationType: string,
  quantity: number
): ChangeQuotaQtyAction => ({
  type: QUOTA_ACTIONS.CHANGE_QUOTA_QTY,
  payload: {
    invitationType,
    quantity,
  },
});