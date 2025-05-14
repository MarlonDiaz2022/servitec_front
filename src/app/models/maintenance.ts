

import { toolInterface } from "./tools"; 

export interface maintenanceInterface {
  _id: string; 
  toolID: toolInterface; 
  comment: string; 
}