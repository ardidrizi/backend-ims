import { Router } from "express";
import { adminProtectedRoute } from "./controllers/userController";
import { checkAdmin } from "./middlewares/checkAdmin";

const router = Router();

// ...existing code...

router.get("/admin-protected-route", checkAdmin, adminProtectedRoute);

export default router;
