import { model, models } from "mongoose";
import { CallCollectionSchema } from "./CallCollectionModel";
import { ConfigurationSchema } from "./CompilationModel";
import { IntegrationSchema } from "./IntegrationModel";
import { PackagesSchema } from "./POSModel";
import { sessionSchema } from "./Session";
import { userSchema } from "./User";
import { PetPoojaOrderSchema } from "./petPoojaOrder";
import { CallConversationSchema } from "./CallConversation";
const CallCollectionModel = models.callcollection || model("callcollection", CallCollectionSchema);
const ConfigurationModel = models.modelconfig || model("modelconfig", ConfigurationSchema);
const IntegrationModel = models.integration || model("integration", IntegrationSchema);
const POSCollectionModel = models.POSCollection || model("POSCollection", PackagesSchema);
const OrderModel = models.posorder || model("posorder", PetPoojaOrderSchema);
const Session = models.Session || model("Session", sessionSchema);
const User = models.User || model("User", userSchema);
const CallConversationModel = models.CallConversation || model("CallConversation", CallConversationSchema);
export {CallCollectionModel,ConfigurationModel,IntegrationModel,POSCollectionModel,Session,User ,OrderModel,CallConversationModel}