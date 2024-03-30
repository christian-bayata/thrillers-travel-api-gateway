export class RetrievePlanesDto {
  batch?: number;
  limit?: number;
  search?: string;
  userId: string;
}

export class RetrieveBookingsDto extends RetrievePlanesDto {
  flag: string;
  filterStartDate?: string;
  filterEndDate?: string;
}
