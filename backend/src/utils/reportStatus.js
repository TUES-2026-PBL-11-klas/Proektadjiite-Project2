import { Status } from '@prisma/client';

const allowedTransitions = {
  [Status.submitted]: [Status.in_progress],
  [Status.in_progress]: [Status.resolved],
  [Status.resolved]: [Status.archived],
  [Status.archived]: [],
};

export const isStatusValue = (value) => Object.values(Status).includes(value);

export const assertValidStatusTransition = (currentStatus, nextStatus) => {
  if (currentStatus === nextStatus) {
    throw new Error('report is already in the requested status');
  }

  if (!allowedTransitions[currentStatus]?.includes(nextStatus)) {
    throw new Error(
      `invalid status transition from ${currentStatus} to ${nextStatus}`,
    );
  }
};
