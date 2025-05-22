

import { toolInterface } from "./tools"; 

export interface maintenanceInterface {
  maintenancescode: string; 
  toolID: toolInterface; 
  comment: string; 
  createdAt:Date;
}