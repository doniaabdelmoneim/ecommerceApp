import { Router } from "express";
import * as AC from "./analytics.controller.js";
import { auth, authorization } from './../../middleware/auth.js';
import { systemRoles } from "../../utils/sysremRoles.js";

const analyticsRouter = Router();
analyticsRouter.get("/",auth,authorization(systemRoles.admin),AC.AnalyticsData);

    

export default analyticsRouter;



