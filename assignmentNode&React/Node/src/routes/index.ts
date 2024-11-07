import { Router } from "express";
import {
  updateApparel,
  updateMultipleApparels,
  checkOrder,
  lowestCost,
  createApparel,
} from "../controllers/ApparelController";

const router = Router();

router.post("/create", createApparel);
router.put("/update", updateApparel);
router.put("/update-multiple", updateMultipleApparels);
router.post("/check-order", checkOrder);
router.post("/lowest-cost", lowestCost);

export default router;
