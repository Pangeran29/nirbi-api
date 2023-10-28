export enum FILE_DESTINATION {
  STATUS = 'status',
  PROFILE = 'profile',
}

export function availableFileDestionation(): string[] {
  const availableDestination: string[] = [];
  for (const key in FILE_DESTINATION) {
    availableDestination.push(FILE_DESTINATION[key]);
  }
  return availableDestination;
}
