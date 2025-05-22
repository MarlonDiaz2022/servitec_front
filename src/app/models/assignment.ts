
import { toolInterface } from "./tools";
import { usersInterface } from "./users";

export interface assignmentInterface{

_id: string;
tool: toolInterface; 
worker: usersInterface;
place:string;
date_of_loan:Date;
delivery_date:Date
status:boolean;

}