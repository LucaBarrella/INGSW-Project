import { VisitDTO } from "../VisitDTO";

// example: {"content":[],"pageable":{"pageNumber":0,"pageSize":20,"sort":{"sorted":false,"empty":true,"unsorted":true},"offset":0,"paged":true,"unpaged":false},"totalPages":0,"totalElements":0,"last":true,"size":20,"number":0,"sort":{"sorted":false,"empty":true,"unsorted":true},"numberOfElements":0,"first":true,"empty":true}
// Java: Page<AgentVisitDTO>
export interface PagedVisitsDTO {
  content: VisitDTO[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      empty: boolean;
      unsorted: boolean;
    };
  }
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    empty: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  first: boolean;
  empty: boolean;
};