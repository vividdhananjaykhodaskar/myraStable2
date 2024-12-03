'user server'

import { startCall } from "../../lib/service/callService";
export async function createCall(callData:any):Promise<any>{
    try {
        const result = await startCall(callData);
        return result?.data._id ?? '-1';
      } catch (error) {
        console.log('error>>>>>>>>>>>>>>>>>>',error)
      }
}